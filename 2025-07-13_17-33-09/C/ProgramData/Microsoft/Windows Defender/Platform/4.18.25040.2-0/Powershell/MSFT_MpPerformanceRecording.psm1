## Copyright (c) Microsoft Corporation. All rights reserved.

<#
.SYNOPSIS
This cmdlet collects a performance recording of Microsoft Defender Antivirus
scans.

.DESCRIPTION
This cmdlet collects a performance recording of Microsoft Defender Antivirus
scans. These performance recordings contain Microsoft-Antimalware-Engine
and NT kernel process events and can be analyzed after collection using the
Get-MpPerformanceReport cmdlet.

This cmdlet requires elevated administrator privileges.

The performance analyzer provides insight into problematic files that could
cause performance degradation of Microsoft Defender Antivirus. This tool is
provided "AS IS", and is not intended to provide suggestions on exclusions.
Exclusions can reduce the level of protection on your endpoints. Exclusions,
if any, should be defined with caution.

.EXAMPLE
New-MpPerformanceRecording -RecordTo:.\Defender-scans.etl

#>
function New-MpPerformanceRecording {
    [CmdletBinding(DefaultParameterSetName='Interactive')]
    param(

        # Specifies the location where to save the Microsoft Defender Antivirus
        # performance recording.
        [Parameter(Mandatory=$true)]
        [ValidateNotNullOrEmpty()]
        [string]$RecordTo,

        # Specifies the duration of the performance recording in seconds.
        [Parameter(Mandatory=$true, ParameterSetName='Timed')]
        [ValidateRange(0,2147483)]
        [int]$Seconds,

        # Specifies the PSSession object in which to create and save the Microsoft
        # Defender Antivirus performance recording. When you use this parameter,
        # the RecordTo parameter refers to the local path on the remote machine.
        [Parameter(Mandatory=$false)]
        [System.Management.Automation.Runspaces.PSSession[]]$Session,

        # Optional argument to specifiy a different tool for recording traces. Default is wpr.exe
        # When $Session parameter is used this path represents a location on the remote machine.
        [Parameter(Mandatory=$false)]
        [string]$WPRPath = $null

    )

    [bool]$interactiveMode = ($PSCmdlet.ParameterSetName -eq 'Interactive')
    [bool]$timedMode = ($PSCmdlet.ParameterSetName -eq 'Timed')

    # Hosts
    [string]$powerShellHostConsole = 'ConsoleHost'
    [string]$powerShellHostISE = 'Windows PowerShell ISE Host'
    [string]$powerShellHostRemote = 'ServerRemoteHost'

    if ($interactiveMode -and ($Host.Name -notin @($powerShellHostConsole, $powerShellHostISE, $powerShellHostRemote))) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException 'Cmdlet supported only on local PowerShell console, Windows PowerShell ISE and remote PowerShell console.'
        $category = [System.Management.Automation.ErrorCategory]::NotImplemented
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'NotImplemented',$category,$Host.Name
        $psCmdlet.WriteError($errRecord)
        return
    }

    if ($null -ne $Session) {
        [int]$RemotedSeconds = if ($timedMode) { $Seconds } else { -1 }

        Invoke-Command -Session:$session -ArgumentList:@($RecordTo, $RemotedSeconds) -ScriptBlock:{
            param(
                [Parameter(Mandatory=$true)]
                [ValidateNotNullOrEmpty()]
                [string]$RecordTo,

                [Parameter(Mandatory=$true)]
                [ValidateRange(-1,2147483)]
                [int]$RemotedSeconds
            )

            if ($RemotedSeconds -eq -1) {
                New-MpPerformanceRecording -RecordTo:$RecordTo -WPRPath:$WPRPath
            } else {
                New-MpPerformanceRecording -RecordTo:$RecordTo -Seconds:$RemotedSeconds -WPRPath:$WPRPath
            }
        }

        return
    }

    if (-not (Test-Path -LiteralPath:$RecordTo -IsValid)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "Cannot record Microsoft Defender Antivirus performance recording to path '$RecordTo' because the location does not exist."
        $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'InvalidPath',$category,$RecordTo
        $psCmdlet.WriteError($errRecord)
        return
    }

    # Resolve any relative paths
    $RecordTo = $psCmdlet.SessionState.Path.GetUnresolvedProviderPathFromPSPath($RecordTo)

    # Dependencies: WPR Profile
    [string]$wprProfile = "$PSScriptRoot\MSFT_MpPerformanceRecording.wprp"

    if (-not (Test-Path -LiteralPath:$wprProfile -PathType:Leaf)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "Cannot find dependency file '$wprProfile' because it does not exist."
        $category = [System.Management.Automation.ErrorCategory]::ObjectNotFound
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'PathNotFound',$category,$wprProfile
        $psCmdlet.WriteError($errRecord)
        return
    }

    # Dependencies: WPR Version
    try 
    {
        # If user provides a valid string as $WPRPath we go with that.
        [string]$wprCommand = $WPRPath

        if (!$wprCommand) {
            $wprCommand = "wpr.exe"
            $wprs = @(Get-Command -All "wpr" 2> $null)

            if ($wprs -and ($wprs.Length -ne 0)) {
                $latestVersion = [System.Version]"0.0.0.0"

                $wprs | ForEach-Object {
                    $currentVersion = $_.Version
                    $currentFullPath = $_.Source
                    $currentVersionString = $currentVersion.ToString()
                    Write-Host "Found $currentVersionString at $currentFullPath"

                    if ($currentVersion -gt $latestVersion) {
                        $latestVersion = $currentVersion
                        $wprCommand = $currentFullPath
                    }
                }
            }
        }
    }
    catch
    {
        # Fallback to the old ways in case we encounter an error (ex: version string format change).
        [string]$wprCommand = "wpr.exe"
    }
    finally 
    {
        Write-Host "`nUsing $wprCommand version $((Get-Command $wprCommand).FileVersionInfo.FileVersion)`n"    
    }
 
    #
    # Test dependency presence
    #
    if (-not (Get-Command $wprCommand -ErrorAction:SilentlyContinue)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "Cannot find dependency command '$wprCommand' because it does not exist."
        $category = [System.Management.Automation.ErrorCategory]::ObjectNotFound
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'PathNotFound',$category,$wprCommand
        $psCmdlet.WriteError($errRecord)
        return
    }

    # Exclude versions that have known bugs or are not supported any more.
    [int]$wprFileVersion = ((Get-Command $wprCommand).Version.Major) -as [int]
    if ($wprFileVersion -le 6) {
        $ex = New-Object System.Management.Automation.PSNotSupportedException "You are using an older and unsupported version of '$wprCommand'. Please download and install Windows ADK:`r`nhttps://docs.microsoft.com/en-us/windows-hardware/get-started/adk-install`r`nand try again."
        $category = [System.Management.Automation.ErrorCategory]::NotInstalled
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'NotSupported',$category,$wprCommand
        $psCmdlet.WriteError($errRecord)
        return
    }

    function CancelPerformanceRecording {
        Write-Host "`n`nCancelling Microsoft Defender Antivirus performance recording... " -NoNewline

        & $wprCommand -cancel -instancename MSFT_MpPerformanceRecording
        $wprCommandExitCode = $LASTEXITCODE

        switch ($wprCommandExitCode) {
            0 {}
            0xc5583000 {
                Write-Error "Cannot cancel performance recording because currently Windows Performance Recorder is not recording."
                return
            }
            default {
                Write-Error ("Cannot cancel performance recording: 0x{0:x08}." -f $wprCommandExitCode)
                return
            }
        }

        Write-Host "ok.`n`nRecording has been cancelled."
    }

    #
    # Ensure Ctrl-C doesn't abort the app without cleanup
    #

    # - local PowerShell consoles: use [Console]::TreatControlCAsInput; cleanup performed and output preserved
    # - PowerShell ISE: use try { ... } catch { throw } finally; cleanup performed and output preserved
    # - remote PowerShell: use try { ... } catch { throw } finally; cleanup performed but output truncated

    [bool]$canTreatControlCAsInput = $interactiveMode -and ($Host.Name -eq $powerShellHostConsole)
    $savedControlCAsInput = $null

    $shouldCancelRecordingOnTerminatingError = $false

    try
    {
        if ($canTreatControlCAsInput) {
            $savedControlCAsInput = [Console]::TreatControlCAsInput
            [Console]::TreatControlCAsInput = $true
        }

        #
        # Start recording
        #

        Write-Host "Starting Microsoft Defender Antivirus performance recording... " -NoNewline

        $shouldCancelRecordingOnTerminatingError = $true

        & $wprCommand -start "$wprProfile!Scans.Light" -filemode -instancename MSFT_MpPerformanceRecording
        $wprCommandExitCode = $LASTEXITCODE

        switch ($wprCommandExitCode) {
            0 {}
            0xc5583001 {
                $shouldCancelRecordingOnTerminatingError = $false
                Write-Error "Cannot start performance recording because Windows Performance Recorder is already recording."
                return
            }
            default {
                $shouldCancelRecordingOnTerminatingError = $false
                Write-Error ("Cannot start performance recording: 0x{0:x08}." -f $wprCommandExitCode)
                return
            }
        }

        Write-Host "ok.`n`nRecording has started." -NoNewline

        if ($timedMode) {
            Write-Host "`n`n   Recording for $Seconds seconds... " -NoNewline

            Start-Sleep -Seconds:$Seconds
            
            Write-Host "ok." -NoNewline
        } elseif ($interactiveMode) {
            $stopPrompt = "`n`n=> Reproduce the scenario that is impacting the performance on your device.`n`n   Press <ENTER> to stop and save recording or <Ctrl-C> to cancel recording"

            if ($canTreatControlCAsInput) {
                Write-Host "${stopPrompt}: "

                do {
                    $key = [Console]::ReadKey($true)
                    if (($key.Modifiers -eq [ConsoleModifiers]::Control) -and (($key.Key -eq [ConsoleKey]::C))) {

                        CancelPerformanceRecording

                        $shouldCancelRecordingOnTerminatingError = $false

                        #
                        # Restore Ctrl-C behavior
                        #

                        [Console]::TreatControlCAsInput = $savedControlCAsInput

                        return
                    }

                } while (($key.Modifiers -band ([ConsoleModifiers]::Alt -bor [ConsoleModifiers]::Control -bor [ConsoleModifiers]::Shift)) -or ($key.Key -ne [ConsoleKey]::Enter))

            } else {
                Read-Host -Prompt:$stopPrompt
            }
        }

        #
        # Stop recording
        #

        Write-Host "`n`nStopping Microsoft Defender Antivirus performance recording... "

        & $wprCommand -stop $RecordTo -instancename MSFT_MpPerformanceRecording
        $wprCommandExitCode = $LASTEXITCODE

        switch ($wprCommandExitCode) {
            0 {
                $shouldCancelRecordingOnTerminatingError = $false
            }
            0xc5583000 {
                $shouldCancelRecordingOnTerminatingError = $false
                Write-Error "Cannot stop performance recording because Windows Performance Recorder is not recording a trace."
                return
            }
            default {
                Write-Error ("Cannot stop performance recording: 0x{0:x08}." -f $wprCommandExitCode)
                return
            }
        }

        Write-Host "ok.`n`nRecording has been saved to '$RecordTo'."

        Write-Host `
'
The performance analyzer provides insight into problematic files that could
cause performance degradation of Microsoft Defender Antivirus. This tool is
provided "AS IS", and is not intended to provide suggestions on exclusions.
Exclusions can reduce the level of protection on your endpoints. Exclusions,
if any, should be defined with caution.
'
Write-Host `
'
The trace you have just captured may contain personally identifiable information,
including but not necessarily limited to paths to files accessed, paths to
registry accessed and process names. Exact information depends on the events that
were logged. Please be aware of this when sharing this trace with other people.
'
    } catch {
        throw
    } finally {
        if ($shouldCancelRecordingOnTerminatingError) {
            CancelPerformanceRecording
        }

        if ($null -ne $savedControlCAsInput) {
            #
            # Restore Ctrl-C behavior
            #

            [Console]::TreatControlCAsInput = $savedControlCAsInput
        }
    }
}

function PadUserDateTime
{
    [OutputType([DateTime])]
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [DateTime]$UserDateTime
    )

    # Padding user input to include all events up to the start of the next second.
    if (($UserDateTime.Ticks % 10000000) -eq 0)
    {
        return $UserDateTime.AddTicks(9999999)
    }
    else
    {
        return $UserDateTime
    }
}

function ValidateTimeInterval
{
    [OutputType([PSCustomObject])]
    param(
        [DateTime]$MinStartTime = [DateTime]::MinValue,
        [DateTime]$MinEndTime = [DateTime]::MinValue,
        [DateTime]$MaxStartTime = [DateTime]::MaxValue,
        [DateTime]$MaxEndTime = [DateTime]::MaxValue
    )

    $ret = [PSCustomObject]@{
        arguments = [string[]]@()
        status = $false
    }
    
    if ($MinStartTime -gt $MaxEndTime)
    {
        $ex = New-Object System.Management.Automation.ValidationMetadataException "MinStartTime '$MinStartTime' should have been lower than MaxEndTime '$MaxEndTime'"
        $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Invalid time interval',$category,"'$MinStartTime' .. '$MaxEndTime'"
        $psCmdlet.WriteError($errRecord)
        return $ret
    }

    if ($MinStartTime -gt $MaxStartTime)
    {
        $ex = New-Object System.Management.Automation.ValidationMetadataException "MinStartTime '$MinStartTime' should have been lower than MaxStartTime '$MaxStartTime'"
        $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Invalid time interval',$category,"'$MinStartTime' .. '$MaxStartTime'"
        $psCmdlet.WriteError($errRecord)
        return $ret
    }

    if ($MinEndTime -gt $MaxEndTime)
    {
        $ex = New-Object System.Management.Automation.ValidationMetadataException "MinEndTime '$MinEndTime' should have been lower than MaxEndTime '$MaxEndTime'"
        $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Invalid time interval',$category,"'$MinEndTime' .. '$MaxEndTime'"
        $psCmdlet.WriteError($errRecord)
        return $ret
    }

    if ($MinStartTime -gt [DateTime]::MinValue)
    {
        try
        {
            $MinStartFileTime = $MinStartTime.ToFileTime()
        }
        catch
        {
            $ex = New-Object System.Management.Automation.ValidationMetadataException "MinStartTime '$MinStartTime' is not a valid timestamp."
            $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
            $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Value has to be a local DateTime between "January 1, 1601 12:00:00 AM UTC" and "December 31, 9999 11:59:59 PM UTC"',$category,"'$MinStartTime'"
            $psCmdlet.WriteError($errRecord)
            return $ret
        }

        $ret.arguments += @('-MinStartTime', $MinStartFileTime)
    }

    if ($MaxEndTime -lt [DateTime]::MaxValue)
    {
        try 
        {
            $MaxEndFileTime = $MaxEndTime.ToFileTime()
        }
        catch 
        {
            $ex = New-Object System.Management.Automation.ValidationMetadataException "MaxEndTime '$MaxEndTime' is not a valid timestamp."
            $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
            $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Value has to be a local DateTime between "January 1, 1601 12:00:00 AM UTC" and "December 31, 9999 11:59:59 PM UTC"',$category,"'$MaxEndTime'"
            $psCmdlet.WriteError($errRecord)
            return $ret               
        }
    
        $ret.arguments += @('-MaxEndTime', $MaxEndFileTime)
    }

    if ($MaxStartTime -lt [DateTime]::MaxValue)
    {
        try
        {
            $MaxStartFileTime = $MaxStartTime.ToFileTime()
        }
        catch
        {
            $ex = New-Object System.Management.Automation.ValidationMetadataException "MaxStartTime '$MaxStartTime' is not a valid timestamp."
            $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
            $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Value has to be a local DateTime between "January 1, 1601 12:00:00 AM UTC" and "December 31, 9999 11:59:59 PM UTC"',$category,"'$MaxStartTime'"
            $psCmdlet.WriteError($errRecord)
            return $ret
        }

        $ret.arguments += @('-MaxStartTime', $MaxStartFileTime)
    }

    if ($MinEndTime -gt [DateTime]::MinValue)
    {
        try 
        {
            $MinEndFileTime = $MinEndTime.ToFileTime()
        }
        catch 
        {
            $ex = New-Object System.Management.Automation.ValidationMetadataException "MinEndTime '$MinEndTime' is not a valid timestamp."
            $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
            $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'Value has to be a local DateTime between "January 1, 1601 12:00:00 AM UTC" and "December 31, 9999 11:59:59 PM UTC"',$category,"'$MinEndTime'"
            $psCmdlet.WriteError($errRecord)
            return $ret              
        }
        
        $ret.arguments += @('-MinEndTime', $MinEndFileTime)
    }

    $ret.status = $true
    return $ret
}

function ParseFriendlyDuration
{
    [OutputType([TimeSpan])]
    param(
        [Parameter(Mandatory = $true, Position = 0)]
        [string]
        $FriendlyDuration
    )

    if ($FriendlyDuration -match '^(\d+)(?:\.(\d+))?(sec|ms|us)$')
    {
        [string]$seconds = $Matches[1]
        [string]$decimals = $Matches[2]
        [string]$unit = $Matches[3]

        [uint32]$magnitude =
            switch ($unit)
            {
                'sec' {7}
                'ms' {4}
                'us' {1}
            }

        if ($decimals.Length -gt $magnitude)
        {
            throw [System.ArgumentException]::new("String '$FriendlyDuration' was not recognized as a valid Duration: $($decimals.Length) decimals specified for time unit '$unit'; at most $magnitude expected.")
        }

        return [timespan]::FromTicks([int64]::Parse($seconds + $decimals.PadRight($magnitude, '0')))
    }

    [timespan]$result = [timespan]::FromTicks(0)
    if ([timespan]::TryParse($FriendlyDuration, [ref]$result))
    {
        return $result
    }

    throw [System.ArgumentException]::new("String '$FriendlyDuration' was not recognized as a valid Duration; expected a value like '0.1234567sec' or '0.1234ms' or '0.1us' or a valid TimeSpan.")
}

[scriptblock]$FriendlyTimeSpanToString = { '{0:0.0000}ms' -f ($this.Ticks / 10000.0) }

function New-FriendlyTimeSpan
{
    param(
        [Parameter(Mandatory = $true)]
        [uint64]$Ticks,

        [bool]$Raw = $false
    )

    if ($Raw) {
        return $Ticks
    }

    $result = [TimeSpan]::FromTicks($Ticks)
    $result.PsTypeNames.Insert(0, 'MpPerformanceReport.TimeSpan')
    $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyTimeSpanToString
    $result
}

function New-FriendlyDateTime
{
    param(
        [Parameter(Mandatory = $true)]
        [uint64]$FileTime,

        [bool]$Raw = $false
    )

    if ($Raw) {
        return $FileTime
    }

    [DateTime]::FromFileTime($FileTime)
}

function Add-DefenderCollectionType
{
    param(
        [Parameter(Mandatory = $true)]
        [ref]$CollectionRef
    )

    if ($CollectionRef.Value.Length -and ($CollectionRef.Value | Get-Member -Name:'Processes','Files','Extensions','Scans','Folder'))
    {
        $CollectionRef.Value.PSTypeNames.Insert(0, 'MpPerformanceReport.NestedCollection')
    }
}

[scriptblock]$FriendlyScanInfoToString = { 
    [PSCustomObject]@{
        ScanType = $this.ScanType
        StartTime = $this.StartTime
        EndTime = $this.EndTime
        Duration = $this.Duration
        Reason = $this.Reason
        Path = $this.Path
        ProcessPath = $this.ProcessPath
        ProcessId = $this.ProcessId
        Image = $this.Image
    }
}

function Get-ScanComments
{
    param(
        [PSCustomObject[]]$SecondaryEvents,
        [bool]$Raw = $false
    )

    $Comments = @()

    foreach ($item in @($SecondaryEvents | Sort-Object -Property:StartTime)) {
        if (($item | Get-Member -Name:'Message' -MemberType:NoteProperty).Count -eq 1) {
            if (($item | Get-Member -Name:'Duration' -MemberType:NoteProperty).Count -eq 1) {
                $Duration  = New-FriendlyTimeSpan -Ticks:$item.Duration -Raw:$Raw
                $StartTime = New-FriendlyDateTime -FileTime:$item.StartTime -Raw:$Raw

                $Comments += "Expensive operation `"{0}`" started at {1} lasted {2}" -f ($item.Message, $StartTime, $Duration.ToString())

                if (($item | Get-Member -Name:'Debug' -MemberType:NoteProperty).Count -eq 1) {
                    $item.Debug | ForEach-Object {
                        if ($_.EndsWith("is NOT trusted") -or $_.StartsWith("Not trusted, ") -or $_.ToLower().Contains("error") -or $_.Contains("Result of ValidateTrust")) {
                            $Comments += "$_"
                        }
                    }
                }
            }
            else {
                if ($item.Message.Contains("subtype=Lowfi")) {
                    $Comments += $item.Message.Replace("subtype=Lowfi", "Low-fidelity detection")
                }
                else {
                    $Comments += $item.Message
                }
            }
        }
        elseif (($item | Get-Member -Name:'ScanType' -MemberType:NoteProperty).Count -eq 1) {
            $Duration = New-FriendlyTimeSpan -Ticks:$item.Duration -Raw:$Raw
            $OpId = "Internal opertion"
            
            if (($item | Get-Member -Name:'Path' -MemberType:NoteProperty).Count -eq 1) {
                $OpId = $item.Path
            }
            elseif (($item | Get-Member -Name:'ProcessPath' -MemberType:NoteProperty).Count -eq 1) {
                $OpId = $item.ProcessPath
            }

            $Comments += "{0} {1} lasted {2}" -f ($item.ScanType, $OpId, $Duration.ToString())
        }
    }

    $Comments 
}

filter ConvertTo-DefenderScanInfo
{
    param(
        [bool]$Raw = $false
    )

    $result = [PSCustomObject]@{
        ScanType = [string]$_.ScanType
        StartTime = New-FriendlyDateTime -FileTime:$_.StartTime -Raw:$Raw
        EndTime = New-FriendlyDateTime -FileTime:$_.EndTime -Raw:$Raw
        Duration = New-FriendlyTimeSpan -Ticks:$_.Duration -Raw:$Raw
        Reason = [string]$_.Reason
        SkipReason = [string]$_.SkipReason
    }

    if (($_ | Get-Member -Name:'Path' -MemberType:NoteProperty).Count -eq 1) {
        $result | Add-Member -NotePropertyName:'Path' -NotePropertyValue:([string]$_.Path)
    }

    if (($_ | Get-Member -Name:'ProcessPath' -MemberType:NoteProperty).Count -eq 1) {
        $result | Add-Member -NotePropertyName:'ProcessPath' -NotePropertyValue:([string]$_.ProcessPath)
    }

    if (($_ | Get-Member -Name:'Image' -MemberType:NoteProperty).Count -eq 1) {
        $result | Add-Member -NotePropertyName:'Image' -NotePropertyValue:([string]$_.Image)
    }
    elseif ($_.ProcessPath -and (-not $_.ProcessPath.StartsWith("pid"))) {
        try {
            $result | Add-Member -NotePropertyName:'Image' -NotePropertyValue:([string]([System.IO.FileInfo]$_.ProcessPath).Name)
        } catch {
            # Silently ignore.
        }
    }

    $ProcessId = if ($_.ProcessId -gt 0) { [int]$_.ProcessId } elseif ($_.ScannedProcessId -gt 0) { [int]$_.ScannedProcessId } else { $null }
    if ($ProcessId) {
        $result | Add-Member -NotePropertyName:'ProcessId' -NotePropertyValue:([int]$ProcessId)
    }

    if ($result.Image -and $result.ProcessId) {
        $ProcessName = "{0} ({1})" -f $result.Image, $result.ProcessId
        $result | Add-Member -NotePropertyName:'ProcessName' -NotePropertyValue:([string]$ProcessName)
    }

    if ((($_ | Get-Member -Name:'Extra' -MemberType:NoteProperty).Count -eq 1) -and ($_.Extra.Count -gt 0)) {
        $Comments = @(Get-ScanComments -SecondaryEvents:$_.Extra -Raw:$Raw)
        $result | Add-Member -NotePropertyName:'Comments' -NotePropertyValue:$Comments
    }

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScanInfo')
    }

    $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyScanInfoToString
    $result
}

filter ConvertTo-DefenderScanOverview
{
    param(
        [bool]$Raw = $false
    )

    $vals = [ordered]@{}

    foreach ($entry in $_.PSObject.Properties) {
        if ($entry.Value) {
            $Key = $entry.Name.Replace("_", " ")

            if ($Key.EndsWith("Time")) {
                $vals[$Key] = New-FriendlyDateTime -FileTime:$entry.Value -Raw:$Raw
            }
            elseif ($Key.EndsWith("Duration")) {
                $vals[$Key] = New-FriendlyTimeSpan -Ticks:$entry.Value -Raw:$Raw
            }
            else {
                $vals[$Key] = $entry.Value
            }
        }
    }

    # Remove duplicates
    if (($_ | Get-Member -Name:'PerfHints' -MemberType:NoteProperty).Count -eq 1) {
        $hints = [ordered]@{}
        foreach ($hint in $_.PerfHints) {
            $hints[$hint] = $true
        }

        $vals["PerfHints"] = @($hints.Keys)
    }

    $result = New-Object PSCustomObject -Property:$vals
    $result
}

filter ConvertTo-DefenderScanStats
{
    param(
        [bool]$Raw = $false
    )

    $result = [PSCustomObject]@{
        Count = $_.Count
        TotalDuration = New-FriendlyTimeSpan -Ticks:$_.TotalDuration -Raw:$Raw
        MinDuration = New-FriendlyTimeSpan -Ticks:$_.MinDuration -Raw:$Raw
        AverageDuration = New-FriendlyTimeSpan -Ticks:$_.AverageDuration -Raw:$Raw
        MaxDuration = New-FriendlyTimeSpan -Ticks:$_.MaxDuration -Raw:$Raw
        MedianDuration = New-FriendlyTimeSpan -Ticks:$_.MedianDuration -Raw:$Raw
    }

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScanStats')
    }

    $result
}

[scriptblock]$FriendlyScannedFilePathStatsToString = {
    [PSCustomObject]@{
        Count = $this.Count
        TotalDuration = $this.TotalDuration
        MinDuration = $this.MinDuration
        AverageDuration = $this.AverageDuration
        MaxDuration = $this.MaxDuration
        MedianDuration = $this.MedianDuration
        Path = $this.Path
    }
}

filter ConvertTo-DefenderScannedFilePathStats
{
    param(
        [bool]$Raw = $false
    )

    $result = $_ | ConvertTo-DefenderScanStats -Raw:$Raw

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScannedFilePathStats')
    }
    
    $result | Add-Member -NotePropertyName:'Path' -NotePropertyValue:($_.Path)
    $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyScannedFilePathStatsToString

    if ($null -ne $_.Scans)
    {
        $result | Add-Member -NotePropertyName:'Scans' -NotePropertyValue:@(
            $_.Scans | ConvertTo-DefenderScanInfo -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Scans)
        }
    }

    if ($null -ne $_.Processes)
    {
        $result | Add-Member -NotePropertyName:'Processes' -NotePropertyValue:@(
            $_.Processes | ConvertTo-DefenderScannedProcessStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Processes)
        }
    }

    $result
}

[scriptblock]$FriendlyScannedPathsStatsToString = { 
    [PSCustomObject]@{
        Count = $this.Count
        TotalDuration = $this.TotalDuration
        MinDuration = $this.MinDuration
        AverageDuration = $this.AverageDuration
        MaxDuration = $this.MaxDuration
        MedianDuration = $this.MedianDuration
        Path = $this.Path
        Folder = $this.Folder
    }
}

filter ConvertTo-DefenderScannedPathsStats
{
    param(
        [bool]$Raw = $false
    )

    $result = $_ | ConvertTo-DefenderScanStats -Raw:$Raw

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScannedPathStats')
    }

    $result | Add-Member -NotePropertyName:'Path' -NotePropertyValue:($_.Path)

    if ($null -ne $_.Folder)
    {
        $result | Add-Member -NotePropertyName:'Folder' -NotePropertyValue:@(
            $_.Folder | ConvertTo-DefenderScannedPathsStats -Raw:$Raw
        )
        $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyScannedPathsStatsToString

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Folder)
        }
    }

    if ($null -ne $_.Files)
    {
        $result | Add-Member -NotePropertyName:'Files' -NotePropertyValue:@(
            $_.Files | ConvertTo-DefenderScannedFilePathStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Files)
        }
    }

    if ($null -ne $_.Scans)
    {
        $result | Add-Member -NotePropertyName:'Scans' -NotePropertyValue:@(
            $_.Scans | ConvertTo-DefenderScanInfo -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Scans)
        }
    }

    if ($null -ne $_.Processes)
    {
        $result | Add-Member -NotePropertyName:'Processes' -NotePropertyValue:@(
            $_.Processes | ConvertTo-DefenderScannedProcessStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Processes)
        }
    }

    $result
}

[scriptblock]$FriendlyScannedFileExtensionStatsToString = {
    [PSCustomObject]@{
        Count = $this.Count
        TotalDuration = $this.TotalDuration
        MinDuration = $this.MinDuration
        AverageDuration = $this.AverageDuration
        MaxDuration = $this.MaxDuration
        MedianDuration = $this.MedianDuration
        Extension = $this.Extension
    }
}

filter ConvertTo-DefenderScannedFileExtensionStats
{
    param(
        [bool]$Raw = $false
    )

    $result = $_ | ConvertTo-DefenderScanStats -Raw:$Raw

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScannedFileExtensionStats')
    }

    $result | Add-Member -NotePropertyName:'Extension' -NotePropertyValue:($_.Extension)
    $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyScannedFileExtensionStatsToString

    if ($null -ne $_.Scans)
    {
        $result | Add-Member -NotePropertyName:'Scans' -NotePropertyValue:@(
            $_.Scans | ConvertTo-DefenderScanInfo -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Scans)
        }
    }

    if ($null -ne $_.Files)
    {
        $result | Add-Member -NotePropertyName:'Files' -NotePropertyValue:@(
            $_.Files | ConvertTo-DefenderScannedFilePathStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Files)
        }
    }

    if ($null -ne $_.Processes)
    {
        $result | Add-Member -NotePropertyName:'Processes' -NotePropertyValue:@(
            $_.Processes | ConvertTo-DefenderScannedProcessStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Processes)
        }
    }


    if ($null -ne $_.Folder)
    {
        $result | Add-Member -NotePropertyName:'Folder' -NotePropertyValue:@(
            $_.Folder | ConvertTo-DefenderScannedPathsStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Folder)
        }
    }

    $result
}

[scriptblock]$FriendlyScannedProcessStatsToString = { 
    [PSCustomObject]@{
        Count = $this.Count
        TotalDuration = $this.TotalDuration
        MinDuration = $this.MinDuration
        AverageDuration = $this.AverageDuration
        MaxDuration = $this.MaxDuration
        MedianDuration = $this.MedianDuration
        ProcessPath = $this.ProcessPath
    }
}

filter ConvertTo-DefenderScannedProcessStats
{
    param(
        [bool]$Raw
    )

    $result = $_ | ConvertTo-DefenderScanStats -Raw:$Raw

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.ScannedProcessStats')
    }

    $result | Add-Member -NotePropertyName:'ProcessPath' -NotePropertyValue:($_.Process)
    $result | Add-Member -Force -MemberType:ScriptMethod -Name:'ToString' -Value:$FriendlyScannedProcessStatsToString

    if ($null -ne $_.Scans)
    {
        $result | Add-Member -NotePropertyName:'Scans' -NotePropertyValue:@(
            $_.Scans | ConvertTo-DefenderScanInfo -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Scans)
        }
    }

    if ($null -ne $_.Files)
    {
        $result | Add-Member -NotePropertyName:'Files' -NotePropertyValue:@(
            $_.Files | ConvertTo-DefenderScannedFilePathStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Files)
        }
    }

    if ($null -ne $_.Extensions)
    {
        $result | Add-Member -NotePropertyName:'Extensions' -NotePropertyValue:@(
            $_.Extensions | ConvertTo-DefenderScannedFileExtensionStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Extensions)
        }
    }

    if ($null -ne $_.Folder)
    {
        $result | Add-Member -NotePropertyName:'Folder' -NotePropertyValue:@(
            $_.Folder | ConvertTo-DefenderScannedPathsStats -Raw:$Raw
        )

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.Folder)
        }
    }

    $result
}

<#
.SYNOPSIS
This cmdlet reports the file paths, file extensions, and processes that cause
the highest impact to Microsoft Defender Antivirus scans.

.DESCRIPTION
This cmdlet analyzes a previously collected Microsoft Defender Antivirus
performance recording and reports the file paths, file extensions and processes
that cause the highest impact to Microsoft Defender Antivirus scans.

The performance analyzer provides insight into problematic files that could
cause performance degradation of Microsoft Defender Antivirus. This tool is
provided "AS IS", and is not intended to provide suggestions on exclusions.
Exclusions can reduce the level of protection on your endpoints. Exclusions,
if any, should be defined with caution.

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10 -TopExtensions:10 -TopProcesses:10 -TopScans:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10 -TopExtensions:10 -TopProcesses:10 -TopScans:10 -Raw | ConvertTo-Json

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10 -TopScansPerFile:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10 -TopProcessesPerFile:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopFiles:10 -TopProcessesPerFile:3 -TopScansPerProcessPerFile:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopScansPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopScansPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopFilesPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopFilesPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopFilesPerPath:3 -TopScansPerFilePerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopFilesPerPath:3 -TopScansPerFilePerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopExtensionsPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopExtensionsPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopExtensionsPerPath:3 -TopScansPerExtensionPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopExtensionsPerPath:3 -TopScansPerExtensionPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopProcessesPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopProcessesPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopPathsDepth:3 -TopProcessesPerPath:3 -TopScansPerProcessPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopPaths:10 -TopProcessesPerPath:3 -TopScansPerProcessPerPath:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopScansPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopPathsPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopPathsPerExtension:3 -TopPathsDepth:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopPathsPerExtension:3 -TopPathsDepth:3 -TopScansPerPathPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopPathsPerExtension:3 -TopScansPerPathPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopFilesPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopFilesPerExtension:3 -TopScansPerFilePerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopProcessesPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopExtensions:10 -TopProcessesPerExtension:3 -TopScansPerProcessPerExtension:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopScansPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopExtensionsPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopExtensionsPerProcess:3 -TopScansPerExtensionPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopFilesPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopFilesPerProcess:3 -TopScansPerFilePerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopPathsPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopPathsPerProcess:3 -TopPathsDepth:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopPathsPerProcess:3 -TopPathsDepth:3 -TopScansPerPathPerProcess:3

.EXAMPLE
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopProcesses:10 -TopPathsPerProcess:3 -TopScansPerPathPerProcess:3

.EXAMPLE
# Find top 10 scans with longest durations that both start and end between MinStartTime and MaxEndTime:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:"5/14/2022 7:01:11 AM" -MaxEndTime:"5/14/2022 7:01:41 AM"

.EXAMPLE
# Find top 10 scans with longest durations between MinEndTime and MaxStartTime, possibly partially overlapping this period
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinEndTime:"5/14/2022 7:01:11 AM" -MaxStartTime:"5/14/2022 7:01:41 AM"

.EXAMPLE
# Find top 10 scans with longest durations between MinStartTime and MaxStartTime, possibly partially overlapping this period
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:"5/14/2022 7:01:11 AM" -MaxStartTime:"5/14/2022 7:01:41 AM"

.EXAMPLE
# Find top 10 scans with longest durations that start at MinStartTime or later:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:"5/14/2022 7:01:11 AM"

.EXAMPLE
# Find top 10 scans with longest durations that start before or at MaxStartTime:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MaxStartTime:"5/14/2022 7:01:11 AM"

.EXAMPLE
# Find top 10 scans with longest durations that end at MinEndTime or later:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinEndTime:"5/14/2022 7:01:11 AM"

.EXAMPLE
# Find top 10 scans with longest durations that end before or at MaxEndTime:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MaxEndTime:"5/14/2022 7:01:11 AM"

.EXAMPLE
# Find top 10 scans with longest durations, impacting the current interval, that did not start or end between MaxStartTime and MinEndTime.
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MaxStartTime:"5/14/2022 7:01:11 AM" -MinEndTime:"5/14/2022 7:01:41 AM"

.EXAMPLE
# Find top 10 scans with longest durations, impacting the current interval, that started between MinStartTime and MaxStartTime, and ended later than MinEndTime.
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:"5/14/2022 7:00:00 AM" -MaxStartTime:"5/14/2022 7:01:11 AM" -MinEndTime:"5/14/2022 7:01:41 AM"

.EXAMPLE
# Find top 10 scans with longest durations, impacting the current interval, that started before MaxStartTime, and ended between MinEndTime and MaxEndTime.
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MaxStartTime:"5/14/2022 7:01:11 AM" -MinEndTime:"5/14/2022 7:01:41 AM" -MaxEndTime:"5/14/2022 7:02:00 AM"

.EXAMPLE
# Find top 10 scans with longest durations, impacting the current interval, that started between MinStartTime and MaxStartTime, and ended between MinEndTime and MaxEndTime.
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:"5/14/2022 7:00:00 AM" -MaxStartTime:"5/14/2022 7:01:11 AM" -MinEndTime:"5/14/2022 7:01:41 AM" -MaxEndTime:"5/14/2022 7:02:00 AM"

.EXAMPLE
# Find top 10 scans with longest durations that both start and end between MinStartTime and MaxEndTime, using DateTime as raw numbers in FILETIME format, e.g. from -Raw report format:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinStartTime:([DateTime]::FromFileTime(132969744714304340)) -MaxEndTime:([DateTime]::FromFileTime(132969745000971033))

.EXAMPLE
# Find top 10 scans with longest durations between MinEndTime and MaxStartTime, possibly partially overlapping this period, using DateTime as raw numbers in FILETIME format, e.g. from -Raw report format:
Get-MpPerformanceReport -Path:.\Defender-scans.etl -TopScans:10 -MinEndTime:([DateTime]::FromFileTime(132969744714304340)) -MaxStartTime:([DateTime]::FromFileTime(132969745000971033))

.EXAMPLE
# Display a summary or overview of the scans captured in the trace, in addition to the information displayed regularly through other arguments. Output is influenced by time interval arguments MinStartTime and MaxEndTime.
Get-MpPerformanceReport -Path:.\Defender-scans.etl [other arguments] -Overview

#>

function Get-MpPerformanceReport {
    [CmdletBinding()]
    param(
        # Specifies the location of Microsoft Defender Antivirus performance recording to analyze.
        [Parameter(Mandatory=$true,
                Position=0,
                ValueFromPipeline=$true,
                ValueFromPipelineByPropertyName=$true,
                HelpMessage="Location of Microsoft Defender Antivirus performance recording.")]
        [ValidateNotNullOrEmpty()]
        [string]$Path,

        # Requests a top files report and specifies how many top files to output, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopFiles = 0,

        # Specifies how many top scans to output for each top file, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerFile = 0,

        # Specifies how many top processes to output for each top file, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopProcessesPerFile = 0,

        # Specifies how many top scans to output for each top process for each top file, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerProcessPerFile = 0,

        # Requests a top paths report and specifies how many top entries to output, sorted by "Duration". This is called recursively for each directory entry. Scans are grouped hierarchically per folder and sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopPaths = 0,

        # Specifies the maxmimum depth (path-wise) that will be used to grop scans when $TopPaths is used.
        [ValidateRange(1,1024)]
        [int]$TopPathsDepth = 0,

        # Specifies how many top scans to output for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerPath = 0,

        # Specifies how many top files to output for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopFilesPerPath = 0,

        # Specifies how many top scans to output for each top file for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerFilePerPath = 0,

        # Specifies how many top extensions to output for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopExtensionsPerPath = 0,
    
        # Specifies how many top scans to output for each top extension for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerExtensionPerPath = 0,

        # Specifies how many top processes to output for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopProcessesPerPath = 0,

        # Specifies how many top scans to output for each top process for each top path, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerProcessPerPath = 0,

        # Requests a top extensions report and specifies how many top extensions to output, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopExtensions = 0,

        # Specifies how many top scans to output for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerExtension = 0,

        # Specifies how many top paths to output for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopPathsPerExtension = 0,

        # Specifies how many top scans to output for each top path for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerPathPerExtension = 0,

        # Specifies how many top files to output for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopFilesPerExtension = 0,

        # Specifies how many top scans to output for each top file for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerFilePerExtension = 0,

        # Specifies how many top processes to output for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopProcessesPerExtension = 0,

        # Specifies how many top scans to output for each top process for each top extension, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerProcessPerExtension = 0,

        # Requests a top processes report and specifies how many top processes to output, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopProcesses = 0,

        # Specifies how many top scans to output for each top process in the Top Processes report, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerProcess = 0,

        # Specifies how many top files to output for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopFilesPerProcess = 0,

        # Specifies how many top scans to output for each top file for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerFilePerProcess = 0,

        # Specifies how many top extensions to output for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopExtensionsPerProcess = 0,

        # Specifies how many top scans to output for each top extension for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerExtensionPerProcess = 0,

        # Specifies how many top paths to output for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopPathsPerProcess = 0,

        # Specifies how many top scans to output for each top path for each top process, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScansPerPathPerProcess = 0,

        # Requests a top scans report and specifies how many top scans to output, sorted by "Duration".
        [ValidateRange(0,([int]::MaxValue))]
        [int]$TopScans = 0,

        ## TimeSpan format: d | h:m | h:m:s | d.h:m | h:m:.f | h:m:s.f | d.h:m:s | d.h:m:.f | d.h:m:s.f => d | (d.)?h:m(:s(.f)?)? | ((d.)?h:m:.f)

        # Specifies the minimum duration of any scans or total scan durations of files, extensions and processes included in the report.
        # Accepts values like  '0.1234567sec' or '0.1234ms' or '0.1us' or a valid TimeSpan.
        [ValidatePattern('^(?:(?:(\d+)(?:\.(\d+))?(sec|ms|us))|(?:\d+)|(?:(\d+\.)?\d+:\d+(?::\d+(?:\.\d+)?)?)|(?:(\d+\.)?\d+:\d+:\.\d+))$')]
        [string]$MinDuration = '0us',

        # Specifies the minimum start time of scans included in the report. Accepts a valid DateTime.
        [DateTime]$MinStartTime = [DateTime]::MinValue,

        # Specifies the minimum end time of scans included in the report. Accepts a valid DateTime.
        [DateTime]$MinEndTime = [DateTime]::MinValue,

        # Specifies the maximum start time of scans included in the report. Accepts a valid DateTime.
        [DateTime]$MaxStartTime = [DateTime]::MaxValue,

        # Specifies the maximum end time of scans included in the report. Accepts a valid DateTime.
        [DateTime]$MaxEndTime = [DateTime]::MaxValue,

        # Adds an overview or summary of the scans captured in the trace to the regular output.
        [switch]$Overview,

        # Specifies that the output should be machine readable and readily convertible to serialization formats like JSON.
        # - Collections and elements are not be formatted.
        # - TimeSpan values are represented as number of 100-nanosecond intervals.
        # - DateTime values are represented as number of 100-nanosecond intervals since January 1, 1601 (UTC).
        [switch]$Raw
    )

    #
    # Validate performance recording presence
    #

    if (-not (Test-Path -Path:$Path -PathType:Leaf)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "Cannot find path '$Path'."
        $category = [System.Management.Automation.ErrorCategory]::ObjectNotFound
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'PathNotFound',$category,$Path
        $psCmdlet.WriteError($errRecord)
        return
    }

    function ParameterValidationError {
        [CmdletBinding()]
        param (
            [Parameter(Mandatory)]
            [string]
            $ParameterName,

            [Parameter(Mandatory)]
            [string]
            $ParentParameterName
        )

        $ex = New-Object System.Management.Automation.ValidationMetadataException "Parameter '$ParameterName' requires parameter '$ParentParameterName'."
        $category = [System.Management.Automation.ErrorCategory]::MetadataError
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'InvalidParameter',$category,$ParameterName
        $psCmdlet.WriteError($errRecord)
    }

    #
    # Additional parameter validation
    #

    if ($TopFiles -eq 0)
    {
        if ($TopScansPerFile -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerFile' -ParentParameterName:'TopFiles'
        }

        if ($TopProcessesPerFile -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopProcessesPerFile' -ParentParameterName:'TopFiles'
        }
    }

    if ($TopProcessesPerFile -eq 0)
    {
        if ($TopScansPerProcessPerFile -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerProcessPerFile' -ParentParameterName:'TopProcessesPerFile'
        }
    }

    if ($TopPathsDepth -gt 0)
    {
        if (($TopPaths -eq 0) -and ($TopPathsPerProcess -eq 0) -and ($TopPathsPerExtension -eq 0))
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopPathsDepth' -ParentParameterName:'TopPaths or TopPathsPerProcess or TopPathsPerExtension'
        }
    }

    if ($TopPaths -eq 0) 
    {
        if ($TopScansPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerPath' -ParentParameterName:'TopPaths'
        }

        if ($TopFilesPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopFilesPerPath' -ParentParameterName:'TopPaths'
        }

        if ($TopExtensionsPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopExtensionsPerPath' -ParentParameterName:'TopPaths'
        }

        if ($TopProcessesPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopProcessesPerPath' -ParentParameterName:'TopPaths'
        }
    }

    if ($TopFilesPerPath -eq 0) 
    {
        if ($TopScansPerFilePerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerFilePerPath' -ParentParameterName:'TopFilesPerPath'
        }
    }

    if ($TopExtensionsPerPath -eq 0) 
    {
        if ($TopScansPerExtensionPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerExtensionPerPath' -ParentParameterName:'TopExtensionsPerPath'
        }
    }

    if ($TopProcessesPerPath -eq 0) 
    {
        if ($TopScansPerProcessPerPath -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerProcessPerPath' -ParentParameterName:'TopProcessesPerPath'
        }
    }

    if ($TopExtensions -eq 0)
    {
        if ($TopScansPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerExtension' -ParentParameterName:'TopExtensions'
        }

        if ($TopFilesPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopFilesPerExtension' -ParentParameterName:'TopExtensions'
        }

        if ($TopProcessesPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopProcessesPerExtension' -ParentParameterName:'TopExtensions'
        }

        if ($TopPathsPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopPathsPerExtension' -ParentParameterName:'TopExtensions'
        } 
    }

    if ($TopFilesPerExtension -eq 0)
    {
        if ($TopScansPerFilePerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerFilePerExtension' -ParentParameterName:'TopFilesPerExtension'
        }
    }

    if ($TopProcessesPerExtension -eq 0)
    {
        if ($TopScansPerProcessPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerProcessPerExtension' -ParentParameterName:'TopProcessesPerExtension'
        }
    }

    if ($TopPathsPerExtension -eq 0)
    {
        if ($TopScansPerPathPerExtension -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerPathPerExtension' -ParentParameterName:'TopPathsPerExtension'
        }
    }

    if ($TopProcesses -eq 0)
    {
        if ($TopScansPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerProcess' -ParentParameterName:'TopProcesses'
        }

        if ($TopFilesPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopFilesPerProcess' -ParentParameterName:'TopProcesses'
        }

        if ($TopExtensionsPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopExtensionsPerProcess' -ParentParameterName:'TopProcesses'
        }

        if ($TopPathsPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopPathsPerProcess' -ParentParameterName:'TopProcesses'
        }
    }

    if ($TopFilesPerProcess -eq 0)
    {
        if ($TopScansPerFilePerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerFilePerProcess' -ParentParameterName:'TopFilesPerProcess'
        }
    }

    if ($TopExtensionsPerProcess -eq 0)
    {
        if ($TopScansPerExtensionPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerExtensionPerProcess' -ParentParameterName:'TopExtensionsPerProcess'
        }
    }

    if ($TopPathsPerProcess -eq 0)
    {
        if ($TopScansPerPathPerProcess -gt 0)
        {
            ParameterValidationError -ErrorAction:Stop -ParameterName:'TopScansPerPathPerProcess' -ParentParameterName:'TopPathsPerProcess'
        }
    }

    if (($TopFiles -eq 0) -and ($TopExtensions -eq 0) -and ($TopProcesses -eq 0) -and ($TopScans -eq 0) -and ($TopPaths -eq 0) -and (-not $Overview)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "At least one of the parameters 'TopFiles', 'TopPaths', 'TopExtensions', 'TopProcesses', 'TopScans' or 'Overview' must be present."
        $category = [System.Management.Automation.ErrorCategory]::InvalidArgument
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'InvalidArgument',$category,$wprProfile
        $psCmdlet.WriteError($errRecord)
        return
    }

    # Dependencies
    [string]$PlatformPath = (Get-ItemProperty -Path:'HKLM:\Software\Microsoft\Windows Defender' -Name:'InstallLocation' -ErrorAction:Stop).InstallLocation

    #
    # Test dependency presence
    #
    [string]$mpCmdRunCommand = "${PlatformPath}MpCmdRun.exe"

    if (-not (Get-Command $mpCmdRunCommand -ErrorAction:SilentlyContinue)) {
        $ex = New-Object System.Management.Automation.ItemNotFoundException "Cannot find '$mpCmdRunCommand'."
        $category = [System.Management.Automation.ErrorCategory]::ObjectNotFound
        $errRecord = New-Object System.Management.Automation.ErrorRecord $ex,'PathNotFound',$category,$mpCmdRunCommand
        $psCmdlet.WriteError($errRecord)
        return
    } 

    # assemble report arguments

    [string[]]$reportArguments = @(
        $PSBoundParameters.GetEnumerator() |
            Where-Object { $_.Key.ToString().StartsWith("Top") -and ($_.Value -gt 0) } |
            ForEach-Object { "-$($_.Key)"; "$($_.Value)"; }
        )

    [timespan]$MinDurationTimeSpan = ParseFriendlyDuration -FriendlyDuration:$MinDuration

    if ($MinDurationTimeSpan -gt [TimeSpan]::FromTicks(0))
    {
        $reportArguments += @('-MinDuration', ($MinDurationTimeSpan.Ticks))
    }

    $MaxEndTime   = PadUserDateTime -UserDateTime:$MaxEndTime
    $MaxStartTime = PadUserDateTime -UserDateTime:$MaxStartTime

    $ret = ValidateTimeInterval -MinStartTime:$MinStartTime -MaxEndTime:$MaxEndTime -MaxStartTime:$MaxStartTime -MinEndTime:$MinEndTime
    if ($false -eq $ret.status)
    {
        return
    }

    [string[]]$intervalArguments = $ret.arguments
    if (($null -ne $intervalArguments) -and ($intervalArguments.Length -gt 0))
    {
        $reportArguments += $intervalArguments
    }

    if ($Overview)
    {
        $reportArguments += "-Overview"
    }

    $report = (& $mpCmdRunCommand -PerformanceReport -RecordingPath $Path @reportArguments) | Where-Object { -not [string]::IsNullOrEmpty($_) } | ConvertFrom-Json

    $result = [PSCustomObject]@{}

    if (-not $Raw) {
        $result.PSTypeNames.Insert(0, 'MpPerformanceReport.Result')
    }

    if ($TopFiles -gt 0)
    {
        $reportTopFiles = @(if ($null -ne $report.TopFiles) { @($report.TopFiles | ConvertTo-DefenderScannedFilePathStats -Raw:$Raw) } else { @() })
        $result | Add-Member -NotePropertyName:'TopFiles' -NotePropertyValue:$reportTopFiles

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.TopFiles)
        }
    }

    if ($TopPaths -gt 0)
    {
        $reportTopPaths = @(if ($null -ne $report.TopPaths) { @($report.TopPaths | ConvertTo-DefenderScannedPathsStats -Raw:$Raw) } else { @() })
        $result | Add-Member -NotePropertyName:'TopPaths' -NotePropertyValue:$reportTopPaths
    
        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.TopPaths)
        }
    }

    if ($TopExtensions -gt 0)
    {
        $reportTopExtensions = @(if ($null -ne $report.TopExtensions) { @($report.TopExtensions | ConvertTo-DefenderScannedFileExtensionStats -Raw:$Raw) } else { @() })
        $result | Add-Member -NotePropertyName:'TopExtensions' -NotePropertyValue:$reportTopExtensions

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.TopExtensions)
        }
    }

    if ($TopProcesses -gt 0)
    {
        $reportTopProcesses = @(if ($null -ne $report.TopProcesses) { @($report.TopProcesses | ConvertTo-DefenderScannedProcessStats -Raw:$Raw) } else { @() })
        $result | Add-Member -NotePropertyName:'TopProcesses' -NotePropertyValue:$reportTopProcesses

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.TopProcesses)
        }
    }

    if ($TopScans -gt 0)
    {
        $reportTopScans = @(if ($null -ne $report.TopScans) { @($report.TopScans | ConvertTo-DefenderScanInfo -Raw:$Raw) } else { @() })
        $result | Add-Member -NotePropertyName:'TopScans' -NotePropertyValue:$reportTopScans

        if (-not $Raw) {
            Add-DefenderCollectionType -CollectionRef:([ref]$result.TopScans)
        }
    }

    if ($Overview)
    {
        if ($null -ne $report.Overview) {
            $reportOverview = $report.Overview | ConvertTo-DefenderScanOverview -Raw:$Raw
            $result | Add-Member -NotePropertyName:'Overview' -NotePropertyValue:$reportOverview

            if (-not $Raw) {
                $result.Overview.PSTypeNames.Insert(0, 'MpPerformanceReport.Overview')
            }
        }
    }

    $result
}

$exportModuleMemberParam = @{
    Function = @(
        'New-MpPerformanceRecording'
        'Get-MpPerformanceReport'
        )
}

Export-ModuleMember @exportModuleMemberParam

# SIG # Begin signature block
# MIIl9gYJKoZIhvcNAQcCoIIl5zCCJeMCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCABOtUhuRLDSJsH
# 5LjfiBWymKYbjYNumRKF78V/LI3Gd6CCC2IwggTvMIID16ADAgECAhMzAAALjRfo
# TozQcMmkAAAAAAuNMA0GCSqGSIb3DQEBCwUAMHkxCzAJBgNVBAYTAlVTMRMwEQYD
# VQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNy
# b3NvZnQgQ29ycG9yYXRpb24xIzAhBgNVBAMTGk1pY3Jvc29mdCBXaW5kb3dzIFBD
# QSAyMDEwMB4XDTI0MDgyMjIxMzIwNVoXDTI1MDcwNDIxMzIwNVowcDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEaMBgGA1UEAxMRTWljcm9zb2Z0
# IFdpbmRvd3MwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCh4E7Ri5OA
# yPmb7q3dyQb6toqfRY6QGGKDfulXYcupgGPKZu0dHFK4fKaOn60Z1Y1MoNaFWG3f
# e0mpQmrsAw93uYwwDqpMl6r7m1N5HLUkiOSaKO/meceKjprL7USMgRMiK3EWHnTB
# GKs9yqNzpwqvpwTRMnjJDLC35UD7s2Cfn3Yk9jMpTtSwBAeNc7XnS/Pp0GmsXSrZ
# YOOQ9B3GlUkCGoFlscIiYEK3JvJelhYYQAg33us2McxFJJQ+O/BFRko51u1alFzR
# U5ujbc+cr2SpHzlxkIULe4Fvfcv0HRyyeLNBgqunan9xJWf2rAJSMynVUnkgqWZN
# OzHaiYBd9fjZAgMBAAGjggF3MIIBczAfBgNVHSUEGDAWBgorBgEEAYI3CgMGBggr
# BgEFBQcDAzAdBgNVHQ4EFgQUlKchFWOmTlAgDUTsEik8hXWO4o4wVAYDVR0RBE0w
# S6RJMEcxLTArBgNVBAsTJE1pY3Jvc29mdCBJcmVsYW5kIE9wZXJhdGlvbnMgTGlt
# aXRlZDEWMBQGA1UEBRMNMjMwMDI4KzUwMjc5ODAfBgNVHSMEGDAWgBTRT6mKBwjO
# 9CQYmOUA//PWeR03vDBTBgNVHR8ETDBKMEigRqBEhkJodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNXaW5QQ0FfMjAxMC0wNy0wNi5j
# cmwwVwYIKwYBBQUHAQEESzBJMEcGCCsGAQUFBzAChjtodHRwOi8vd3d3Lm1pY3Jv
# c29mdC5jb20vcGtpL2NlcnRzL01pY1dpblBDQV8yMDEwLTA3LTA2LmNydDAMBgNV
# HRMBAf8EAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQCaycnh5i2eis6RuXLbNRi3Bj4O
# 4EpM2wWQr1xABTgVNaKVDAi85hpJN/RsyGP0b4w4Mrf0+ALPSJ9Idowj1Mogd+2a
# dDXe55zNrrBo3rjP6ZWMWGA80ftwWhH5m9Aou9TVjiRw7j4MwVREpeihAf1Ih2m8
# N/DknvQ3ygn0MuvQ549sBPKuB87pIvGzv0y53zjDqenk1DCSqRAZiNm26zr7+fTB
# cT9oOxKTLJXKWEN/ZEQy8nIcY6kGi3GuQxfD9tYfmACSAaVfTnqviXtEqQFHHBal
# s9ZDWp2dTlr3FGtZWeGg2Gb2coCvEyQoKlAHZePOcAHzY7tG65uAv+x1BaXSMIIG
# azCCBFOgAwIBAgIKYQxqGQAAAAAABDANBgkqhkiG9w0BAQsFADCBiDELMAkGA1UE
# BhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAc
# BgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEyMDAGA1UEAxMpTWljcm9zb2Z0
# IFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIwMTAwHhcNMTAwNzA2MjA0MDIz
# WhcNMjUwNzA2MjA1MDIzWjB5MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGlu
# Z3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
# cmF0aW9uMSMwIQYDVQQDExpNaWNyb3NvZnQgV2luZG93cyBQQ0EgMjAxMDCCASIw
# DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMB5uzqx8A+EuK1kKnUWc9C7B/Y+
# DZ0U5LGfwciUsDh8H9AzVfW6I2b1LihIU8cWg7r1Uax+rOAmfw90/FmV3MnGovdS
# cFosHZSrGb+vlX2vZqFvm2JubUu8LzVs3qRqY1pf+/MNTWHMCn4x62wK0E2XD/1/
# OEbmisdzaXZVaZZM5NjwNOu6sR/OKX7ET50TFasTG3JYYlZsioGjZHeYRmUpnYMU
# pUwIoIPXIx/zX99vLM/aFtgOcgQo2Gs++BOxfKIXeU9+3DrknXAna7/b/B7HB9jA
# vguTHijgc23SVOkoTL9rXZ//XTMSN5UlYTRqQst8nTq7iFnho0JtOlBbSNECAwEA
# AaOCAeMwggHfMBAGCSsGAQQBgjcVAQQDAgEAMB0GA1UdDgQWBBTRT6mKBwjO9CQY
# mOUA//PWeR03vDAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTALBgNVHQ8EBAMC
# AYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+iiXGJo0T2UkFvX
# zpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jvc29mdC5jb20v
# cGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0yMy5jcmwwWgYI
# KwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1pY3Jvc29mdC5j
# b20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNydDCBnQYDVR0g
# BIGVMIGSMIGPBgkrBgEEAYI3LgMwgYEwPQYIKwYBBQUHAgEWMWh0dHA6Ly93d3cu
# bWljcm9zb2Z0LmNvbS9QS0kvZG9jcy9DUFMvZGVmYXVsdC5odG0wQAYIKwYBBQUH
# AgIwNB4yIB0ATABlAGcAYQBsAF8AUABvAGwAaQBjAHkAXwBTAHQAYQB0AGUAbQBl
# AG4AdAAuIB0wDQYJKoZIhvcNAQELBQADggIBAC5Bpoa1Bm/wgIX6O8oX6cn65DnC
# lHDDZJTD2FamkI7+5Jr0bfVvjlONWqjzrttGbL5/HVRWGzwdccRRFVR+v+6llUIz
# /Q2QJCTj+dyWyvy4rL/0wjlWuLvtc7MX3X6GUCOLViTKu6YdmocvJ4XnobYKnA0b
# jPMAYkG6SHSHgv1QyfSHKcMDqivfGil56BIkmobt0C7TQIH1B18zBlRdQLX3sWL9
# TUj3bkFHUhy7G8JXOqiZVpPUxt4mqGB1hrvsYqbwHQRF3z6nhNFbRCNjJTZ3b65b
# 3CLVFCNqQX/QQqbb7yV7BOPSljdiBq/4Gw+Oszmau4n1NQblpFvDjJ43X1PRozf9
# pE/oGw5rduS4j7DC6v119yxBt5yj4R4F/peSy39ZA22oTo1OgBfU1XL2VuRIn6Mj
# ugagwI7RiE+TIPJwX9hrcqMgSfx3DF3Fx+ECDzhCEA7bAq6aNx1QgCkepKfZxpol
# Vf1Ayq1kEOgx+RJUeRryDtjWqx4z/gLnJm1hSY/xJcKLdJnf+ZMakBzu3ZQzDkJQ
# 239Q+J9iguymghZ8ZrzsmbDBWF2osJphFJHRmS9J5D6Bmdbm78rj/T7u7AmGAwcN
# Gw186/RayZXPhxIKXezFApLNBZlyyn3xKhAYOOQxoyi05kzFUqOcasd9wHEJBA1w
# 3gI/h+5WoezrtUyFMYIZ6jCCGeYCAQEwgZAweTELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjEjMCEGA1UEAxMaTWljcm9zb2Z0IFdpbmRvd3MgUENB
# IDIwMTACEzMAAAuNF+hOjNBwyaQAAAAAC40wDQYJYIZIAWUDBAIBBQCggZAwGQYJ
# KoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwLwYJKoZIhvcNAQkEMSIEIP1nRydeaI+1
# iJEMHgjg/lvzEqkxTM+0Vgz1fU+wYXo6MEIGCisGAQQBgjcCAQwxNDAyoBSAEgBN
# AGkAYwByAG8AcwBvAGYAdKEagBhodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20wDQYJ
# KoZIhvcNAQEBBQAEggEAgFuisFaW8+p+CVx2abzATOwR5KyKU0Xkg39zoTBfvlsW
# 1mSfDGTPkmDZ2k7pOCfFqho36Mov3LuyLdzxfOOqh/pCnUnxvf8G9ZDAYDDMs2/8
# PgyuqthMEWHjYJ3TA6OheKzhXH+rZKeqgp7NMPNUF5UbQ2pgLOVy7ojXVLtVStRW
# Yohw9c37QVxpD4ct6fn5vR3Sf7vqjax/4f+wm2ai60ufPv5UwIJsIi3DEfRzUjm9
# jjupjmyRv513jjcvz+cW7MjnyySSXxh3WufEo6CxBhIOXBrtF7W2GpOCZdBBE4ni
# o+HLfCKVb9vY41SoMu8mQh3OilNbkbH4LpPRWTDLhKGCF5cwgheTBgorBgEEAYI3
# AwMBMYIXgzCCF38GCSqGSIb3DQEHAqCCF3AwghdsAgEDMQ8wDQYJYIZIAWUDBAIB
# BQAwggFSBgsqhkiG9w0BCRABBKCCAUEEggE9MIIBOQIBAQYKKwYBBAGEWQoDATAx
# MA0GCWCGSAFlAwQCAQUABCD4i/lZkFkGT8tetTZ0p4Yy1TfP+PVfA0cGZ773P1lB
# WgIGZ/e9FGzJGBMyMDI1MDQxNjIzMTcwMi44NjFaMASAAgH0oIHRpIHOMIHLMQsw
# CQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9u
# ZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNy
# b3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMScwJQYDVQQLEx5uU2hpZWxkIFRTUyBF
# U046QTkzNS0wM0UwLUQ5NDcxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1w
# IFNlcnZpY2WgghHtMIIHIDCCBQigAwIBAgITMwAAAgy5ZOM1nOz0rgABAAACDDAN
# BgkqhkiG9w0BAQsFADB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv
# bjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0
# aW9uMSYwJAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMDAeFw0y
# NTAxMzAxOTQzMDBaFw0yNjA0MjIxOTQzMDBaMIHLMQswCQYDVQQGEwJVUzETMBEG
# A1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWlj
# cm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBP
# cGVyYXRpb25zMScwJQYDVQQLEx5uU2hpZWxkIFRTUyBFU046QTkzNS0wM0UwLUQ5
# NDcxJTAjBgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZpY2UwggIiMA0G
# CSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDKAVYmPeRtga/U6jzqyqLD0MAool23
# gcBN58+Z/XskYwNJsZ+O+wVyQYl8dPTK1/BC2xAic1m+JvckqjVaQ32KmURsEZot
# irQY4PKVW+eXwRt3r6szgLuic6qoHlbXox/l0HJtgURkzDXWMkKmGSL7z8/crqcv
# mYqv8t/slAF4J+mpzb9tMFVmjwKXONVdRwg9Q3WaPZBC7Wvoi7PRIN2jgjSBnHYy
# AZSlstKNrpYb6+Gu6oSFkQzGpR65+QNDdkP4ufOf4PbOg3fb4uGPjI8EPKlpwMwa
# i1kQyX+fgcgCoV9J+o8MYYCZUet3kzhhwRzqh6LMeDjaXLP701SXXiXc2ZHzuDHb
# S/sZtJ3627cVpClXEIUvg2xpr0rPlItHwtjo1PwMCpXYqnYKvX8aJ8nawT9W8FUu
# uyZPG1852+q4jkVleKL7x+7el8ETehbdkwdhAXyXimaEzWetNNSmG/KfHAp9czws
# L1vKr4Rgn+pIIkZHuomdf5e481K+xIWhLCPdpuV87EqGOK/jbhOnZEqwdvA0AlMa
# LfsmCemZmupejaYuEk05/6cCUxgF4zCnkJeYdMAP+9Z4kVh7tzRFsw/lZSl2D7Eh
# IA6Knj6RffH2k7YtSGSv86CShzfiXaz9y6sTu8SGqF6ObL/eu/DkivyVoCfUXWLj
# iSJsrS63D0EHHQIDAQABo4IBSTCCAUUwHQYDVR0OBBYEFHUORSH/sB/rQ/beD0l5
# VxQ706GIMB8GA1UdIwQYMBaAFJ+nFV0AXmJdg/Tl0mWnG1M1GelyMF8GA1UdHwRY
# MFYwVKBSoFCGTmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01p
# Y3Jvc29mdCUyMFRpbWUtU3RhbXAlMjBQQ0ElMjAyMDEwKDEpLmNybDBsBggrBgEF
# BQcBAQRgMF4wXAYIKwYBBQUHMAKGUGh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9w
# a2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwVGltZS1TdGFtcCUyMFBDQSUyMDIwMTAo
# MSkuY3J0MAwGA1UdEwEB/wQCMAAwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYD
# VR0PAQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4ICAQDZMPr4gVmwwf4GMB5ZfHSr
# 34uhug6yzu4HUT+JWMZqz9uhLZBoX5CPjdKJzwAVvYoNuLmS0+9lA5S74rvKqd/u
# 9vp88VGk6U7gMceatdqpKlbVRdn2ZfrMcpI4zOc6BtuYrzJV4cEs1YmX95uiAxaE
# D34w02BnfuPZXA0edsDBbd4ixFU8X/1J0DfIUk1YFYPOrmwmI2k16u6TcKO0YpRl
# wTdCq9vO0eEIER1SLmQNBzX9h2ccCvtgekOaBoIQ3ZRai8Ds1f+wcKCPzD4qDX3x
# NgvLFiKoA6ZSG9S/yOrGaiSGIeDy5N9VQuqTNjryuAzjvf5W8AQp31hV1GbUDOkb
# Udd+zkJWKX4FmzeeN52EEbykoWcJ5V9M4DPGN5xpFqXy9aO0+dR0UUYWuqeLhDyR
# nVeZcTEu0xgmo+pQHauFVASsVORMp8TF8dpesd+tqkkQ8VNvI20oOfnTfL+7ZgUM
# f7qNV0ll0Wo5nlr1CJva1bfk2Hc5BY1M9sd3blBkezyvJPn4j0bfOOrCYTwYsNsj
# iRl/WW18NOpiwqciwFlUNqtWCRMzC9r84YaUMQ82Bywk48d4uBon5ZA8pXXS7jwJ
# TjJj5USeRl9vjT98PDZyCFO2eFSOFdDdf6WBo/WZUA2hGZ0q+J7j140fbXCfOUIm
# 0j23HaAV0ckDS/nmC/oF1jCCB3EwggVZoAMCAQICEzMAAAAVxedrngKbSZkAAAAA
# ABUwDQYJKoZIhvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNo
# aW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
# cG9yYXRpb24xMjAwBgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRlIEF1
# dGhvcml0eSAyMDEwMB4XDTIxMDkzMDE4MjIyNVoXDTMwMDkzMDE4MzIyNVowfDEL
# MAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
# bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWlj
# cm9zb2Z0IFRpbWUtU3RhbXAgUENBIDIwMTAwggIiMA0GCSqGSIb3DQEBAQUAA4IC
# DwAwggIKAoICAQDk4aZM57RyIQt5osvXJHm9DtWC0/3unAcH0qlsTnXIyjVX9gF/
# bErg4r25PhdgM/9cT8dm95VTcVrifkpa/rg2Z4VGIwy1jRPPdzLAEBjoYH1qUoNE
# t6aORmsHFPPFdvWGUNzBRMhxXFExN6AKOG6N7dcP2CZTfDlhAnrEqv1yaa8dq6z2
# Nr41JmTamDu6GnszrYBbfowQHJ1S/rboYiXcag/PXfT+jlPP1uyFVk3v3byNpOOR
# j7I5LFGc6XBpDco2LXCOMcg1KL3jtIckw+DJj361VI/c+gVVmG1oO5pGve2krnop
# N6zL64NF50ZuyjLVwIYwXE8s4mKyzbnijYjklqwBSru+cakXW2dg3viSkR4dPf0g
# z3N9QZpGdc3EXzTdEonW/aUgfX782Z5F37ZyL9t9X4C626p+Nuw2TPYrbqgSUei/
# BQOj0XOmTTd0lBw0gg/wEPK3Rxjtp+iZfD9M269ewvPV2HM9Q07BMzlMjgK8Qmgu
# EOqEUUbi0b1qGFphAXPKZ6Je1yh2AuIzGHLXpyDwwvoSCtdjbwzJNmSLW6CmgyFd
# XzB0kZSU2LlQ+QuJYfM2BjUYhEfb3BvR/bLUHMVr9lxSUV0S2yW6r1AFemzFER1y
# 7435UsSFF5PAPBXbGjfHCBUYP3irRbb1Hode2o+eFnJpxq57t7c+auIurQIDAQAB
# o4IB3TCCAdkwEgYJKwYBBAGCNxUBBAUCAwEAATAjBgkrBgEEAYI3FQIEFgQUKqdS
# /mTEmr6CkTxGNSnPEP8vBO4wHQYDVR0OBBYEFJ+nFV0AXmJdg/Tl0mWnG1M1Gely
# MFwGA1UdIARVMFMwUQYMKwYBBAGCN0yDfQEBMEEwPwYIKwYBBQUHAgEWM2h0dHA6
# Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvRG9jcy9SZXBvc2l0b3J5Lmh0bTAT
# BgNVHSUEDDAKBggrBgEFBQcDCDAZBgkrBgEEAYI3FAIEDB4KAFMAdQBiAEMAQTAL
# BgNVHQ8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAfBgNVHSMEGDAWgBTV9lbLj+ii
# XGJo0T2UkFvXzpoYxDBWBgNVHR8ETzBNMEugSaBHhkVodHRwOi8vY3JsLm1pY3Jv
# c29mdC5jb20vcGtpL2NybC9wcm9kdWN0cy9NaWNSb29DZXJBdXRfMjAxMC0wNi0y
# My5jcmwwWgYIKwYBBQUHAQEETjBMMEoGCCsGAQUFBzAChj5odHRwOi8vd3d3Lm1p
# Y3Jvc29mdC5jb20vcGtpL2NlcnRzL01pY1Jvb0NlckF1dF8yMDEwLTA2LTIzLmNy
# dDANBgkqhkiG9w0BAQsFAAOCAgEAnVV9/Cqt4SwfZwExJFvhnnJL/Klv6lwUtj5O
# R2R4sQaTlz0xM7U518JxNj/aZGx80HU5bbsPMeTCj/ts0aGUGCLu6WZnOlNN3Zi6
# th542DYunKmCVgADsAW+iehp4LoJ7nvfam++Kctu2D9IdQHZGN5tggz1bSNU5HhT
# dSRXud2f8449xvNo32X2pFaq95W2KFUn0CS9QKC/GbYSEhFdPSfgQJY4rPf5KYnD
# vBewVIVCs/wMnosZiefwC2qBwoEZQhlSdYo2wh3DYXMuLGt7bj8sCXgU6ZGyqVvf
# SaN0DLzskYDSPeZKPmY7T7uG+jIa2Zb0j/aRAfbOxnT99kxybxCrdTDFNLB62FD+
# CljdQDzHVG2dY3RILLFORy3BFARxv2T5JL5zbcqOCb2zAVdJVGTZc9d/HltEAY5a
# GZFrDZ+kKNxnGSgkujhLmm77IVRrakURR6nxt67I6IleT53S0Ex2tVdUCbFpAUR+
# fKFhbHP+CrvsQWY9af3LwUFJfn6Tvsv4O+S3Fb+0zj6lMVGEvL8CwYKiexcdFYmN
# cP7ntdAoGokLjzbaukz5m/8K6TT4JDVnK+ANuOaMmdbhIurwJ0I9JZTmdHRbatGe
# Pu1+oDEzfbzL6Xu/OHBE0ZDxyKs6ijoIYn/ZcGNTTY3ugm2lBRDBcQZqELQdVTNY
# s6FwZvKhggNQMIICOAIBATCB+aGB0aSBzjCByzELMAkGA1UEBhMCVVMxEzARBgNV
# BAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jv
# c29mdCBDb3Jwb3JhdGlvbjElMCMGA1UECxMcTWljcm9zb2Z0IEFtZXJpY2EgT3Bl
# cmF0aW9uczEnMCUGA1UECxMeblNoaWVsZCBUU1MgRVNOOkE5MzUtMDNFMC1EOTQ3
# MSUwIwYDVQQDExxNaWNyb3NvZnQgVGltZS1TdGFtcCBTZXJ2aWNloiMKAQEwBwYF
# Kw4DAhoDFQDvu8hkhEMt5Z8Ldefls7z1LVU8pqCBgzCBgKR+MHwxCzAJBgNVBAYT
# AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJjAkBgNVBAMTHU1pY3Jvc29mdCBU
# aW1lLVN0YW1wIFBDQSAyMDEwMA0GCSqGSIb3DQEBCwUAAgUA66okBTAiGA8yMDI1
# MDQxNjEyNDE0MVoYDzIwMjUwNDE3MTI0MTQxWjB3MD0GCisGAQQBhFkKBAExLzAt
# MAoCBQDrqiQFAgEAMAoCAQACAgW+AgH/MAcCAQACAhJlMAoCBQDrq3WFAgEAMDYG
# CisGAQQBhFkKBAIxKDAmMAwGCisGAQQBhFkKAwKgCjAIAgEAAgMHoSChCjAIAgEA
# AgMBhqAwDQYJKoZIhvcNAQELBQADggEBAD9gEIh+L6IDcw5b62XyyFP4Hqokmrps
# 6GE7R7WvNClNWBSl+9+2g71jo2bP1ulpzsm5U+uZFOIqEtWO9H10CQSgpIUbku27
# cWb/PJTXFqH8umMb1UVKGjTxbrfUz+ZEeQVgy2PNgb95xk6VBMZLh91g3JF2Yr/F
# NZPs43LrL/bJV91UGKK/yRklQ2QW0duLxgbJT3aDzPG9Otb3eX5MgSF1yGl1asoE
# iKmBJ5FXhm7npBN6XDjp6Km4vmaAhWIFCIXpe0u7tg58TWsv48WzpiMdw1bAGkZ6
# FZ0XSpdyfDIJyvWAbSewtCz3ShTwy/FuHrATyWBca3CMsL+ny3t5nIExggQNMIIE
# CQIBATCBkzB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4G
# A1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSYw
# JAYDVQQDEx1NaWNyb3NvZnQgVGltZS1TdGFtcCBQQ0EgMjAxMAITMwAAAgy5ZOM1
# nOz0rgABAAACDDANBglghkgBZQMEAgEFAKCCAUowGgYJKoZIhvcNAQkDMQ0GCyqG
# SIb3DQEJEAEEMC8GCSqGSIb3DQEJBDEiBCACOTJloRH7R2zHiEy5B2IJEr7HhPyq
# 2XrIeiT6HQjcqzCB+gYLKoZIhvcNAQkQAi8xgeowgecwgeQwgb0EINUo17cFMZN4
# 6MI5NfIAg9Ux5cO5xM9inre5riuOZ8ItMIGYMIGApH4wfDELMAkGA1UEBhMCVVMx
# EzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoT
# FU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjEmMCQGA1UEAxMdTWljcm9zb2Z0IFRpbWUt
# U3RhbXAgUENBIDIwMTACEzMAAAIMuWTjNZzs9K4AAQAAAgwwIgQge/tPnpsMp4oH
# wPUcAhc2AfFB61QcPC1HoLsYej37zOwwDQYJKoZIhvcNAQELBQAEggIAo3za4axG
# R1aIbJWV/h5D4O4zw1B+aCwu+gpkzf/6z5+cLwFiE5Oi8lOz6SXZ2Cl5YbitonvA
# +yS3m59TY8YPDUcNJmoCVXVhWasRLsrqzFKLQfclYGmFyABRVW0CWYS8f0GBN6Hq
# pA5rYU+CiypoTaWnyxq0VLqc5twiKJZfWvOr5oboIraynwGvOtfeZdcAQngUMXVQ
# Cp8QfL9+P92P/G4Af8lMHIL0mS3gzH2s/7Ka5SOQ5XfJvDrbjdcE9NwSL2sHnNkA
# VmlCX/fG0KWpAdaPBsBOlKFD3ypzbWu3/OALrzDcPbnPTdX/ZkxsBHtC2ECEP1S8
# Zm22kNv1FB1vEvkuZNYuqHVnH+ljjqiBmxlqOKZSkqdgIRxxqjl/YCNCt7LH/U5F
# 9J7NJdCrl/Fg0mKbFI4HN67SZ86hTcmTGl/eu5VQrseHPPWRhoio6ry6gFeKyUdj
# DJqyqAF7uVlW/bhN7JjR5CZzRV249aAVwBR3P8bMp/6XlJcnBMNnFkwL+O73HLCO
# qy1sq7SRRS7v23MILsqfuE4MZaFtoqdynJPVjQaX6TmKNrVpd/ARadBmRPttH3AS
# Pl+Oyg6s9rg98Vk6Ssa40ZrVMiqbQ/dyQ/HCE+MVVdIHfYca7EZ/n49NMWy1Wh55
# wK89R52IWF1QRKWmmIFKnVM0UWsp2UveQdg=
# SIG # End signature block
