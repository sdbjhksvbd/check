#
# PInvoke functions
#

function CreateWinEvent
(
    $name,
    $manualReset,
    $initialState
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern IntPtr CreateEvent(IntPtr lpEventAttributes, bool bManualReset, bool bInitialState, string lpName);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace CreateEvent -PassThru
    return  $type::CreateEvent(0,$manualReset,$initialState,$name)
}

function CreateWinSemaphore
(
    $name,
    $initialCount,
    $maximumCount
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern IntPtr CreateSemaphore(IntPtr lpSemaphoreAttributes, int lInitialCount, int lMaximumCount, string lpName);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace CreateSemaphore -PassThru
    return  $type::CreateSemaphore(0,$initialCount,$maximumCount,$name)
}

function CloseWinHandle
(
    $h
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern bool CloseHandle(IntPtr handle);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace CloseHandle -PassThru
    return  $type::CloseHandle($h)
}
function WaitForWinMultipleObject
(
    $nCount,
    [System.IntPtr[]]$handles,
    $waitAll,
    [System.UInt32]$timeout
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern uint WaitForMultipleObjects(uint nCount, IntPtr [] lpHandles, bool bWaitAll, uint dwMilliseconds);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace WaitForMultipleObjects -PassThru
    return $type::WaitForMultipleObjects($nCount,$handles,$waitAll,$timeout)
}
function SetWinEvent
(
    $h
)
{

$signature = @'
[DllImport("kernel32.dll")]
public static extern bool SetEvent(IntPtr handle);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace SetEvent -PassThru
    return $type::SetEvent($h)
}

function ResetWinEvent
(
    $h
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern bool ResetEvent(IntPtr handle);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace ResetEvent -PassThru
    return $type::ResetEvent($h)
}

function WaitForWinSingleObject
(
    $h,
    $timeout
)
{
$signature = @'
[DllImport("kernel32.dll")]
public static extern UInt32 WaitForSingleObject(IntPtr hHandle, UInt32 dwMilliseconds);
'@
    $type = Add-Type -MemberDefinition $signature  -Name Win32Utils -Namespace WaitForSingleObject -PassThru
    return $type::WaitForSingleObject($h,$timeout)
}

#
# Printing functions
#
function escapeXmlCharData($charData) {
    ($charData -replace "&", "&amp;") -replace "<", "&lt;"
}

### Splunk Reserved Keys ###
$SplunkMetaKeys = @("SplunkIndex", "SplunkSource", "SplunkHost", "SplunkSourceType", "SplunkTime")

function printPrim($var, $dataBuilder)
{
    [void]$dataBuilder.Append("&quot;")
    if ($var -ne $null) {
        $escapedVal = escapeXmlCharData $var.ToString()
        [void]$dataBuilder.Append($escapedVal)
    }

    [void]$dataBuilder.Append("&quot;")
}

function printKvs($var, [hashtable]$reservedProps, $dataBuilder)
{
    if ($var -eq $null) {
        return
    }
    $props=$var.psobject.properties | select name

    foreach($p in $props) {
        try {
            $pVal= $var|Select -ExpandProperty $p.Name
        } catch {
            $pVal=""
        }

        # if this is a reserved property, populate its value but don't print out
        if ($SplunkMetaKeys -contains $p.Name.ToString()) {
            $reservedProps[$p.Name.ToString()]=$pVal.ToString()
            continue
        }

        # build k=v
        $escapedKey = escapeXmlCharData $p.Name.ToString()
        [void]$dataBuilder.Append($escapedKey)
        [void]$dataBuilder.Append("=")
        printPrim $pVal $dataBuilder
        [void]$dataBuilder.Append("`n")
    }
}

function printHashTable($var, [hashtable]$reservedProps, $dataBuilder)
{
    [void]$dataBuilder.Clear()
    [void]$dataBuilder.Append("<data>")

    foreach($k in $var.Keys) {
        # if this is a reserved property, populate its value
        # but don't print out
        if ($SplunkMetaKeys -contains $k.ToString()) {
            $reservedProps[$k.ToString()]=$var[$k]
            continue
        }

        # build k/vs
        $escapedKey = escapeXmlCharData $k.ToString()
        [void]$dataBuilder.Append($escapedKey)
        [void]$dataBuilder.Append("=")
        printPrim $var[$k] $dataBuilder
        [void]$dataBuilder.Append(" ")
    }

    [void]$dataBuilder.Append("</data>`n")
}

function ifPrimitiveType($v)
{
    if(($v -is [System.Boolean]) -or
    ($v -is [System.Byte]) -or
    ($v -is [System.SByte]) -or
    ($v -is [System.Char]) -or
    ($v -is [System.Decimal]) -or
    ($v -is [System.Double]) -or
    ($v -is [System.Single]) -or
    ($v -is [System.Int32]) -or
    ($v -is [System.UInt32]) -or
    ($v -is [System.Int64]) -or
    ($v -is [System.UInt64]) -or
    ($v -is [System.Int16]) -or
    ($v -is [System.UInt16]) -or
    ($v -is [System.String]) ) {
        return $True;
    } else {
        return $False;
    }
}

# printType serialize $var to key/value pairs and wraps around the
# key/value paris by <data>k/v paris</data> tag
function printType($var, [hashtable]$reservedProps, $dataBuilder)
{
    [void]$dataBuilder.Clear()
    [void]$dataBuilder.Append("<data>")
    if(ifPrimitiveType($var)) {
        # output as string
        if ($var -ne $null) {
            $escapedVal = escapeXmlCharData $var.ToString()
            [void]$dataBuilder.Append($escapedVal)
        }
    } else {
        printKvs $var $reservedProps $dataBuilder
    }
    [void]$dataBuilder.Append("</data>`n")
}

function printEventHdr([hashtable]$stanza, [hashtable]$reservedProps, $headBuilder)
{
    [void]$headBuilder.Clear()
    [void]$headBuilder.Append('<event stanza="powershell://')
    [void]$headBuilder.Append($stanza.name)
    [void]$headBuilder.Append(""">`n")
    $time = if($reservedProps["SplunkTime"]) {
        $reservedProps["SplunkTime"]
    } else {
        getEpochTime
    }

    [void]$headBuilder.Append("<time>")
    [void]$headBuilder.Append($time)
    [void]$headBuilder.Append("</time>`n")
}

function printEventEnd ([hashtable]$stanza, [hashtable]$reservedProps, $tailBuilder)
{
    [void]$tailBuilder.Clear()
    $host1 = if($reservedProps["SplunkHost"]) {
        $reservedProps["SplunkHost"]
    } else {
        $null
    }

    $index = if($reservedProps["SplunkIndex"]) {
        $reservedProps["SplunkIndex"]
    } else {
        $stanza.index
    }

    $source = if($reservedProps["SplunkSource"]) {
        $reservedProps["SplunkSource"]
    } else {
        $stanza.source
    }

    $sourcetype = if($reservedProps["SplunkSourceType"]) {
        $reservedProps["SplunkSourceType"]
    } else {
        $stanza.sourcetype
    }

    if ($host1) {
        [void]$tailBuilder.Append("<host>")
        [void]$tailBuilder.Append($host1)
        [void]$tailBuilder.Append("</host>`n")
    }

    if ($index) {
        [void]$tailBuilder.Append("<index>")
        [void]$tailBuilder.Append($index)
        [void]$tailBuilder.Append("</index>`n")
    }

    [void]$tailBuilder.Append("<source>")
    [void]$tailBuilder.Append($source)
    [void]$tailBuilder.Append("</source>`n<sourcetype>")
    [void]$tailBuilder.Append($sourcetype)
    [void]$tailBuilder.Append("</sourcetype>`n</event>")
}

function doPrint($var, $stanza, $headBuilder, $dataBuilder, $tailBuilder, $eventsBuilder, $printDataFunc)
{
    $reservedProps = @{}

    # print object first in case we need populate $reservedProps
    [void]$printDataFunc.Invoke($var, $reservedProps, $dataBuilder)
    if ($dataBuilder.Length -eq 14) {
        # <data></data>`n, empty data, splunk doesn't like this
        return
    }

    # header must go after printType, since printType inits
    # reservedProps
    printEventHdr $stanza $reservedProps $headBuilder
    printEventEnd $stanza $reservedProps $tailBuilder

    # Commit the event
    [void]$eventsBuilder.Append($headBuilder.ToString())
    [void]$eventsBuilder.Append($dataBuilder.ToString())
    [void]$eventsBuilder.Append($tailBuilder.ToString())
}


# printTypes serializes $var to key/value pairs in modinput XML format
# by reusing StringBuilders
function printTypes($var, $stanza, $headBuilder, $dataBuilder, $tailBuilder, $eventsBuilder)
{
    if ($null -eq $var) {
        return
    }

    if($var -is [System.Object[]]) {
        foreach($v in $var) {
            doPrint $v $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder ${function:printType}
        }

        return
    }

    if($var -is [System.Collections.Hashtable]) {
        doPrint $var $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder ${function:printHashTable}
    } else {
        doPrint $var $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder ${function:printType}
    }
}

# -------------- Native JSON serializer ------------

function filterSplunkMetaKeysForObject($var, $reservedProps)
{
    $containsSplunkMetaKeys = $false
    $SplunkMetaKeys.ForEach({
        $metaVal = $var.psobject.properties[$_]
        if ($metaVal -ne $null) {
            $containsSplunkMetaKeys = $true
            if ($metaVal.Value -ne $null) {
                $reservedProps.$_ = $metaVal.Value.ToString()
            }
        }
    })

    if ($containsSplunkMetaKeys) {
        # Removes Splunk meta keys from the object
        $var = Select-Object -InputObject $var -Property * -ExcludeProperty $SplunkMetaKeys
    }
    return $var
}

function filterSplunkMetaKeysForHashTable($var, $reservedProps)
{
    $SplunkMetaKeys.ForEach({
        $metaVal = $var[$_]
        if ($metaVal -ne $null) {
            $reservedProps.$_ = $metaVal.ToString()
        }

        # Remove the splunk meta key, either
        # 1) if the key is non-exist, it is no-op
        # 2) if it is $null value
        $var.Remove($_)
    })
    return $var
}

# printTypeInJson serialize $var to json string and wraps around the
# json string by <data>json string</data> tag
# `$filterFunc` filters splunk meta keys from the $var object and move these key/values
# to $reservedProps for late use
function printTypeInJson($var, $stanza, $headBuilder, $dataBuilder, $tailBuilder, $eventsBuilder, $filterFunc)
{
    if ($var -eq $null) {
        return
    }

    # need filtering splunk meta keys and populate $reservedProps first
    $var = $filterFunc.Invoke($var, $reservedProps)[0]
    $jsonStr = ConvertTo-Json -InputObject $var -Depth 10 -Compress
    if ($jsonStr.Length -eq 0) {
        # Splunk doesn't like empty data
        return
    }
    $escapedJsonStr = escapeXmlCharData $jsonStr

    [void]$dataBuilder.Clear()
    [void]$dataBuilder.Append("<data>")
    [void]$dataBuilder.Append($escapedJsonStr)
    [void]$dataBuilder.Append("</data>`n")

    printEventHdr $stanza $reservedProps $headBuilder
    printEventEnd $stanza $reservedProps $tailBuilder

    # Commit the event
    [void]$eventsBuilder.Append($headBuilder.ToString())
    [void]$eventsBuilder.Append($dataBuilder.ToString())
    [void]$eventsBuilder.Append($tailBuilder.ToString())
}

# printTypesInJson serializes $var to JSON strings in modinput XML format
# by reusing StringBuilders
function printTypesInJson($var, $stanza, $headBuilder, $dataBuilder, $tailBuilder, $eventsBuilder)
{
    if ($null -eq $var) {
        return
    }

    if($var -is [System.Object[]]) {
        # Here we do a recursion in case we have nested array elements
        $var.ForEach({
            printTypesInJson $_ $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder
        })

        return
    }

    $reservedProps = @{}
    if($var -is [System.Collections.Hashtable]) {
        printTypeInJson $var $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder ${function:filterSplunkMetaKeysForHashTable}
    } else {
        printTypeInJson $var $stanza $headBuilder $dataBuilder $tailBuilder $eventsBuilder ${function:filterSplunkMetaKeysForObject}
    }
}

#
# Input functions
#

# Reads input file from splunk-powershell.exe
# Format:
# constants
# SplunkHome:<splunkhome>
# ...
# stanzas
# stanza:<name>
# event_group:<event_group_idx>,<handle_idx>
# script: <script>
# index: <index>
# source: <source>
# sourcetype: <sourcetype>
function readInputFile($lines, $logger)
{
    $constants = @{}
    $stanzas = @()

    $stanza = $null
    $state = ""
    foreach($l in $lines) {
        if ($l -match '^constants$') {
            $state = "constants"
            continue
        } elseif ($l -match '^stanzas$') {
            $state = "stanzas"
            continue
        }

        if ($state -eq  "constants") {
            if ($l -match '^([^:]+):(.*)') {
                $constants[$matches[1]] = $matches[2]
            } else {
               logError "Error: invalid input: $l" $logger
               return $null
            }
        } elseif ($state -eq  "stanzas") {
            if ($l -match '^stanza:(.+)') {
                $stanza = [hashtable]::Synchronized(@{})
                $name = $matches[1]
                logDebug "Found stanza: $name" $logger
                $stanza.name = $name
                $stanzas+=$stanza
            } else {
                if ($stanza.name.length -eq 0) {
                   logError "Error: invalid input, stanza is not the first line" $logger
                   return $null
                }

                if ($l -match '^index:(.+)') {
                    if ($stanza["index"] -ne $null) {
                       logError "Error: stanza already contains index: $($s.name)" $logger
                       return $null
                    }
                    $stanza.index = $matches[1]
                    logDebug "index: $($stanza.index)" $logger
                } elseif ($l -match '^event_group:(.+)') {
                    if ($stanza["eventGroup"] -ne $null) {
                       logError "Error: stanza already contains event_group: $($s.name)" $logger
                       return $null
                    }
                    $stanza.eventGroup=@{}
                    $m = $matches[1].split(",")
                    $stanza.eventGroup[0]=$m[0] -as [int]
                    $stanza.eventGroup[1]=$m[1] -as [int]
                    logDebug ("event_group: "+$stanza.eventGroup[0]+","+$stanza.eventGroup[1]) $logger
                } elseif($l -match '^script:(.+)') {
                    if ($stanza["script"] -ne $null) {
                       logError "Error: stanza already contains script: +$($s.name)" $logger
                       return $null
                    }
                    $stanza.script = $matches[1]
                    logDebug "script: $($stanza.script)" $logger
                } elseif($l -match '^source:(.+)') {
                    if ($stanza["source"] -ne $null) {
                       logError "Error: stanza already contains source: $($s.name)" $logger
                       return $null
                    }
                    $stanza.source = $matches[1]
                    logDebug "source: $($stanza.source)" $logger
                } elseif($l -match '^sourcetype:(.+)') {
                    if ($stanza["sourcetype"] -ne $null) {
                       logError "Error: stanza already contains sourcetype: $($s.name)" $logger
                       return $null
                    }
                    $stanza.sourcetype = $matches[1]
                    logDebug "sourcetype: $($stanza.sourcetype)" $logger
                } elseif($l -match '^io_threads:(.+)') {
                    if ($stanza["ioThreads"] -ne $null) {
                       logError "Error: stanza already contains io_threads: $($s.name)" $logger
                       return $null
                    }
                    $stanza.ioThreads = [int]$matches[1]
                    logDebug "ioThreads: $($stanza.ioThreads)" $logger
                } elseif($l -match '^serialization_threads:(.+)') {
                    if ($stanza["serializationThreads"] -ne $null) {
                       logError "Error: stanza already contains serialization_threads: $($s.name)" $logger
                       return $null
                    }
                    $stanza.serializationThreads = [int]$matches[1]
                    logDebug "serializationThreads: $($stanza.serializationThreads)" $logger
                } elseif($l -match '^event_serialization_format:(.+)') {
                    if ($stanza["eventSerializationFormat"] -ne $null) {
                       logError "Error: stanza already contains event_serialization_format: $($s.name)" $logger
                       return $null
                    }
                    $stanza.eventSerializationFormat = $matches[1]
                    logDebug "eventSerializationFormat: $($stanza.eventSerializationFormat)" $logger
                } elseif($l -match '^process_completion_check_interval:(.+)') {
                    if ($stanza["processCompletionCheckInterval"] -ne $null) {
                       logError "Error: stanza already contains process_completion_check_interval: $($s.name)" $logger
                       return $null
                    }
                    $stanza.processCompletionCheckInterval = [int]$matches[1]
                    logDebug "processCompletionCheckInterval: $($stanza.processCompletionCheckInterval)" $logger
                } else {
                   logError "Error: invalid input: $l" $logger
                   return $null
                }
            }
        } else {
           logError "Error: invalid input: $l" $logger
           return $null
        }
    }
    return [array]($constants, $stanzas)
}

function validateStanza($stanzas, $logger)
{
    if ($stanzas.Count -eq 0) {
       logError "Error: no stanzas" $logger
       return $False
    }

    foreach($s in $stanzas) {
        if (-not $s.ContainsKey("name")) {
           logError "Error: stanza is missing name " $logger
           return $False
        }

        if ((-not $s.ContainsKey("eventGroup")) -and (-not ($s.length -eq 2))) {
           logError "Error: stanza is missing event_group: $($s.name)" $logger
           return $False
        }

        if (-not $s.ContainsKey("script")) {
           logError "Error: stanza is missing script file: $($s.name)" $logger
           return $False
        }

        if (-not $s.ContainsKey("source")) {
           logError "Error: stanza is missing source: $($s.name)" $logger
           return $False
        }

        if (-not $s.ContainsKey("sourcetype")) {
           logError "Error: stanza is missing sourcetype: $($s.name)" $logger
           return $False
        }
    }
    return $True
}

#
# Logger functions
#
function createLoggerImpl
(
    $logger,
    $mutex,
    $file,
    $maxsize,
    $backups,
    [boolean]$ifErr,
    [boolean]$ifWarn,
    [boolean]$ifInfo,
    [boolean]$ifDbg
)
{
    $logger.mutex = $mutex
    $logger.file = $file
    $logger.maxsize = $maxsize
    $logger.backups = $backups
    $logger.err = $ifErr
    $logger.warn = $ifWarn
    $logger.info = $ifInfo
    $logger.dbg = $ifDbg

    $logger.stream = new-object -TypeName System.IO.FileStream `
        $file, ([System.IO.FileMode]::Append), `
        ([System.IO.FileAccess]::Write), ([System.IO.FileShare]::Read)
    $logger.writer = New-Object -TypeName System.IO.StreamWriter $logger.stream
    $logger.writer.AutoFlush = $True

    return $logger
}

function createLogger
(
    $file,
    $maxsize,
    $backups,
    [boolean]$ifErr=$True,
    [boolean]$ifWarn,
    [boolean]$ifInfo,
    [boolean]$ifDbg
)
{
    [bool]$wasCreated = $false;
    $path = [System.Text.Encoding]::UTF8.GetBytes($file)
    $mutexName = [Convert]::ToBase64String($path)
    $mutex = New-Object System.Threading.Mutex($false, $mutexName, [ref] $wasCreated)

    $loggerObject = [hashtable]::Synchronized(@{})

    createLoggerImpl $loggerObject $mutex $file $maxsize $backups `
        $ifErr $ifWarn $ifInfo $ifDbg
}

function trapErrors ($code)
{
    try {
        &$code
    } catch {
        Write-Error "While executing { $code }: $_" -ErrorAction Continue
    }
}

function maybeRoll($logger)
{
    if ($logger.stream.Position -gt $logger.maxsize) {
        function getBackupName ($num) {
            $logger.file + "." + $num
        }

        function renameRemove ($filename) {
            $tempname = $logger.file + "-" + (Get-Date).Ticks + ".tmp"
            trapErrors `
                {
                    Rename-Item $filename $tempname
                    Remove-Item $tempname
                }
        }

        trapErrors { Get-Item ($logger.file + "-*.tmp") } |
            ForEach-Object { trapErrors { Remove-Item $_ } }

        if ($logger.backups -gt 0) {
            $oldestPossibleBackup = getBackupName $logger.backups
            if (Test-Path $oldestPossibleBackup) {
                renameRemove $oldestPossibleBackup
            }

            for ($i = $logger.backups - 1; $i -gt 0; --$i) {
                $backupName = getBackupName $i
                if (Test-Path $backupName) {
                    $newBackupName = getBackupName ($i + 1)
                    trapErrors { Rename-Item $backupName $newBackupName }
                }
            }
        }

        $logger.writer.Close()

        if ($logger.backups -gt 0) {
            $firstBackupName = getBackupName 1
            trapErrors { Rename-Item $logger.file $firstBackupName }
        } else {
            renameRemove $logger.file
        }

        createLoggerImpl `
            $logger $logger.mutex $logger.file $logger.maxsize $logger.backups `
            $logger.err $logger.warn $logger.info $logger.dbg | Out-Null
    }
}

function logImpl($level, $text, $logger)
{
    $t = getLocalTime
    $m = "$t $level $text"
    [void]$logger.mutex.WaitOne()
    try {
        [void]$logger.writer.WriteLine($m)
        [void] (maybeRoll $logger)
    } finally {
        [void]$logger.mutex.ReleaseMutex()
    }
}

function logError($text, $logger)
{
    if ($logger.err) {
        logImpl "ERROR" $text $logger
    }
}

function logWarn($text, $logger)
{
    if ($logger.warn) {
        logImpl "WARN" $text $logger
    }
}

function logInfo($text, $logger)
{
    if ($logger.info) {
        logImpl "INFO" $text $logger
    }
}

function logDebug($text, $logger)
{
    if ($logger.dbg) {
        logImpl "DEBUG" $text $logger
    }
}

# Event functions
function getShutdownEventName ($tag)
{
    return "Shutdown"+$tag;
}

function getEventGroupName ($tag, $stanza)
{
    return "EventGroup_" + $stanza.eventGroup[0] + "_" + $tag;
}

function getTimerEventName ($tag, $stanza)
{
    return "Timer_"+$stanza.name+"_"+$stanza.eventGroup[0]+"_"+$stanza.eventGroup[1]+"_"+$tag;
}

function createShutdownEvent ($tag)
{
    $name = getShutdownEventName $tag
    # use manual reset so multiple listeners can get signalled
    return CreateWinEvent $name 1  0
}

function createGroupEvent ($tag, $stanza)
{
    $name = getEventGroupName $tag $stanza
    return CreateWinSemaphore $name 0  64
}

function createTimerEvent ($tag, $stanza)
{
    $name = getTimerEventName $tag $stanza
    return CreateWinEvent $name 0  0
}

#
# Util functions
#
function getEpochTime
{
    $unixEpochStart = new-object DateTime 1970,1,1,0,0,0,([DateTimeKind]::Utc)
    return [int]([DateTime]::UtcNow - $unixEpochStart).TotalSeconds
}

function getUtcTime
{
    return ((get-date).ToUniversalTime()).ToString("MM-dd-yyyy HH:mm:ss.fffffffz")
}

function getLocalTime
{
    return (get-date).ToString("MM-dd-yyyy HH:mm:ss.fffffffz")
}

function numOfCPUCores()
{
    $cores = (((Get-WmiObject Win32_Processor) `
                | Measure-Object -Sum -Property NumberOfLogicalProcessors).Sum)
    return $cores
}

function getMaxIOThreads($ioThreads)
{
    if (!$ioThreads) {
        $ioThreads = numOfCPUCores
    }
    return $ioThreads
}

function getSerializationThreads($serializationThreads)
{
    if (!$serializationThreads) {
        $serializationThreads = [int]((numOfCPUCores) / 2)
        if ($serializationThreads -lt 1) {
            $serializationThreads = 1
        }
    }
    return $serializationThreads
}

#### job status ####
$PS_JOB_STATUS = "__spl_ps_job_status__"
$PS_JOB_DONE = "done"
$PS_JOB_ENQUEUED = "enqueued"
$PS_JOB_EXEC = "exec"

# execute data input powershell script, streaming the data to
# serializingQueue for further processing
function executeJob($stanza, $batchSize, $serializingQueue, $logger) {
    $script = $stanza.script
    if ($script -imatch ".+\.ps1$") {
        $script = "invoke-expression ("+""""+$script+""" 2>&1)"
    }

    # This needs to be set as it may be used in scripts
    $SplunkStanzaName = $stanza.name

    logInfo "Start executing script=$script for stanza=$SplunkStanzaName" $logger

    $stanza[$PS_JOB_STATUS] = $PS_JOB_EXEC
    $batch = New-Object System.Collections.ArrayList
    $start = get-date
    try {
        invoke-expression ($script) | ForEach-Object {
            [void]$batch.Add($_)
            if ($batch.Count -ge $batchSize) {
                $batchAndStanza = [System.Tuple]::Create($batch.ToArray(), $stanza)
                [void]$serializingQueue.Add($batchAndStanza)
                [void]$batch.Clear()
            }
        }
    } catch {
        # Ignore user exception
        $msg = "Executing script=$script for stanza=$($stanza.name) failed with exception=" + $error[0].ToString()
        logError $msg $logger
    } finally {
        # Mark this job ready for next schedule
        $stanza[$PS_JOB_STATUS] = $PS_JOB_DONE

        # The last batch
        if ($batch.Count -ne 0) {
            $batchAndStanza = [System.Tuple]::Create($batch.ToArray(), $stanza)
            [void]$serializingQueue.Add($batchAndStanza)
            [void]$batch.Clear()
        }

        $execTime = ((get-date) - $start).TotalSeconds
        $msg = "End of executing script=$script for stanza=$($stanza.name), execution_time=$execTime seconds"
        logInfo $msg $logger
    }
}

# io worker runs in a runspace session which include "propBag", "logger"
# It waits for jobs from job queue to execute and puts collected data
# to serializingQueue
$ioScriptBlock = {
    Param (
        $jobQueue,
        $serializingQueue
    )

. $propBag.modPath

    $ErrorActionPreference = "stop"

    logInfo "io worker started" $logger

    $batchSize = $propBag.batchSize
    $tryMilliseconds = 10000
    while (1) {
        $stanza = $null
        if ($jobQueue.TryTake([ref] $stanza, $tryMilliseconds) -eq $False) {
            continue
        }

        if ($null -eq $stanza) {
            # it got a null object which signals to be shutdown
            # notify other job workers
            logInfo "got shutdown signal; signal other io workers" $logger
            [void]$jobQueue.Add($null)
            logInfo "got shutdown signal; signaled other io workers successfully" $logger

            $propBag.ioWorkerDone += 1
            if ($propBag.ioWorkerDone -ge $propBag.ioThreads) {
                logInfo "all io workers are done; signal serializing workers" $logger
                [void]$serializingQueue.Add($null)
            }
            break
        }

        [void](executeJob $stanza $batchSize $serializingQueue $logger)
    }
}

function addToRunspaceCollection($rs, $propBag, $logger)
{
    [void]$propBag.mutantDisposer.WaitOne()
    try {
        [void]$propBag.runspaceCollection.Add($rs)
    } catch {
        logError ("exception in addToRunspaceCollection: "+$error[0].ToString()) $logger
    } finally {
        [void]$propBag.mutantDisposer.ReleaseMutex()
    }
}

# Wait for signal for cron job forever, return the corresponding
# stanza index if one fired
# return a negative integer for other cases
function doWaitCronEvents($handles, $propBag, $logger)
{
    $w = WaitForWinMultipleObject $handles.length $handles 0 ([System.uInt32]::maxvalue)
    if($w -eq 0) {
        # shutdown case
        logDebug "Shutdown signalled" $logger
        $propBag.shutdown = $True
    } elseif($w -lt $handles.length) {
        # one of the jobs is signalled
        $stanzaIdx = ($w - 1) -as [int]
        return $stanzaIdx
    } elseif ($w -eq 0x102) {
        logDebug "Timeout" $logger
    } else {
        logError "Unexpected return from WaitForWinMultipleObject: $w" $logger
        $propBag.shutdown = $True
    }
    return -1
}

# Wait for signal for cron job forever, return the corresponding stanza index if one fired
# return a negative integer for other cases
function doWaitCronEventGroups ($handles, $hmap, $stanzaHandles, $propBag, $logger)
{
    $w = WaitForWinMultipleObject $handles.length $handles 0 ([System.uInt32]::maxvalue)
    if ($w -eq 0) {
        # shutdown case
        logDebug "Shutdown signalled" $logger
        $propBag.shutdown = $True
    } elseif($w -lt $handles.length) {
        # one of the jobs is signalled
        $hs = $stanzaHandles[$w  -as [int]]
        logDebug "Schedule stanza group with id: $w" $logger

        # Wait for stanza handle. Set short timeout to account interval
        # between group event and stanza event
        $w1 = WaitForWinMultipleObject $hs.length $hs 0 200
        if($w1 -lt $hs.length) {
            $stanzaIdx = $hmap.($hs[$w1]) -as [int]
            return $stanzaIdx
        } elseif ($w1 -eq 0x102) {
            logDebug "Timeout" $logger
        } else {
            logError "Unexpected return from WaitForWinMultipleObject: $w1" $logger
            $propBag.shutdown = $True
        }
    } elseif ($w -eq 0x102) {
        logDebug "Timeout" $logger
    } else {
        logError "Unexpected return from WaitForWinMultipleObject: $w" $logger
        $propBag.shutdown = $True
    }
    return -1
}

# serializingScriptBlock runs in a runspace session which include
# "propBag", "logger". It gets powershell objects in the queue and
# serialize the objects to modinput XML
$serializingScriptBlock = {
    Param (
        $serializingQueue,
        $outputQueue
    )

. $propBag.modPath

    $ErrorActionPreference = "stop"

    $headBuilder = New-Object System.Text.StringBuilder
    $dataBuilder = New-Object System.Text.StringBuilder
    $tailBuilder = New-Object System.Text.StringBuilder
    $eventsBuilder = New-Object System.Text.StringBuilder

    $printFunc = if ($propBag["eventSerializationFormat"] -eq "json") {
        ${function:printTypesInJson}
    } else {
        ${function:printTypes}
    }

    logInfo "serializing worker started" $logger

    $tryMilliseconds = 1000
    while (1) {
        $batchAndStanza = $null
        if ($serializingQueue.TryTake([ref] $batchAndStanza, $tryMilliseconds) -eq $False) {
            continue
        }

        if ($null -eq $batchAndStanza) {
            # it got a null object which signals to be shutdown, notify other serializing workers
            logInfo "got shutdown signal; signal other serializing workers" $logger
            [void]$serializingQueue.Add($null)
            logInfo "got shutdown signal; signaled other serializing workers successfully" $logger

            $propBag.serializationWorkerDone += 1
            if ($propBag.serializationWorkerDone -ge $propBag.serializationThreads) {
                logInfo "all serializing workers are done; signal output worker" $logger
                [void]$outputQueue.Add($null)
            }

            break
        }

        $batchAndStanza.Item1.ForEach({
            try {
                [void]$printFunc.Invoke($_, $batchAndStanza.Item2, $headBuilder, $dataBuilder, $tailBuilder, $eventsBuilder)
            } catch {
                logError "failed to serialize data with error=$_" $logger
            }
        })

        $events = $eventsBuilder.ToString()
        [void]$eventsBuilder.Clear()
        [void]$outputQueue.Add($events)
    }
}

# scheduler waits for cron job ready signal from splunk-powershell.exe
$scheduleScriptBlock = {
    Param (
        $waitForCronJobFuncName,
        $params,
        $jobQueue
    )

. $propBag.modPath

    $ErrorActionPreference = "stop"

    logInfo "job scheduler started" $logger

    $stanzas = $params.stanzas
    if ($waitForCronJobFuncName -eq "waitCronEvents") {
        $waitForCronJobFunc = ${function:waitCronEvents}
    } else {
        $waitForCronJobFunc = ${function:waitCronEventGroups}
    }

    # the scheduler waits on an array of events corresponding to each stanza
    # the events gets signalled from splunk-powershell.exe according to cron
    # when an event is signalled, scheduler will push the ready data input instance 
    # to job queue for execution
    # Wait indefinitely until shutdown or timer event is signalled
    while (-not $propBag.shutdown) {
        try {
            $stanzaIdx = $waitForCronJobFunc.Invoke($params, $logger)[0]
        } catch {
            logError "failed to wait cron job $_ " $logger
            break
        }

        if ($stanzaIdx -lt 0) {
            continue
        }

        $stanza = $stanzas[$stanzaIdx]
        if ($stanza[$PS_JOB_STATUS] -ne $null -and $stanza[$PS_JOB_STATUS] -ne $PS_JOB_DONE) {
            # There is overlap found, we don't want to interleave the same job
            # as it may introduce dup data or even corrupt the ckpt
            logInfo "prior run of stanza '$($stanza.name)' is still in progress. Skip this one" $logger
            continue
        }

        logInfo "enqueue job for stanza=$($stanza.name)" $logger
        $stanza[$PS_JOB_STATUS] = $PS_JOB_ENQUEUED
        $jobQueue.Add($stanza)
    }

    logInfo "notify io and serializing workers to shutdown" $logger

    # Inject a null object to signal io pool to shutdown
    [void]$jobQueue.Add($null)
    logInfo "notified io workers to shutdown" $logger
}


function startPool($thrPool, [hashtable]$params, $propBag, $scriptBlock, $tag, $logger) {
    for ($i = 0; $i -le $thrPool.GetMaxRunspaces(); $i++) {
        $ps1 = [powershell]::Create()
        $ps1.RunspacePool = $thrPool
        [void]$ps1.AddScript($scriptBlock, $True)
        if ($params -ne $null -and $params.Count -gt 0) {
            [void]$ps1.AddParameters($params)
        }

        $n = New-Object -TypeName PSObject -Property @{
            Runspace = $ps1.BeginInvoke()
            Powershell = $ps1
            Tag = $tag
        }
        addToRunspaceCollection $n $propBag $logger
    }
}

# Start the io executiong pool threads to wait for job to execute
function startIoPool($ioPool, $jobQueue, $serializingQueue, $propBag, $logger) {
    $params = @{
        jobQueue = $jobQueue
        serializingQueue = $serializingQueue
    }
    startPool $ioPool $params $propBag $ioScriptBlock "io_pool" $logger
}

# Start the serializing pool threads to wait for PSObjects to process
function startSerializingPool($serializingPool, $serializingQueue, $outputQueue, $propBag, $logger) {
    $params = @{
        serializingQueue = $serializingQueue
        outputQueue = $outputQueue
    }
    startPool $serializingPool $params $propBag $serializingScriptBlock "serializing_pool" $logger
}

# Start scheduler in a thread
function startScheduler($schedPool, $waitForCronJobFuncName, $params, $jobQueue, $propBag, $logger) {
    $schedParams = @{
        waitForCronJobFuncName = $waitForCronJobFuncName
        params = $params
        jobQueue = $jobQueue
    }

    startPool $schedPool $schedParams $propBag $scheduleScriptBlock "scheduler" $logger
}

# Schedule jobs in a background thread
# Arch: scheduler schedule job -> jobQueue <- ioPool execute -> serializingQueue
# <- serializingPool serialize objects to modinput XML -> outputQueue
# <- main thread dump modinput XML to stdout
function doScheduleJobs($waitForCronJobFuncName, $params, $logger)
{
    $propBag = $params.propBag
    $stanzas = $params.stanzas

    $sessionVars = @{
        propBag = $propBag
        logger = $logger
    }
    foreach ($const in $params.consts.Keys) {
        $sessionVars[$const] = $params.consts[$const]
    }

    $maxIOThreads = getMaxIOThreads $stanzas[0].ioThreads
    $serializationThreads = getSerializationThreads $stanzas[0].serializationThreads

    $propBag.ioThreads = $maxIOThreads
    $propBag.ioWorkerDone = 0
    $propBag.serializationThreads = $serializationThreads
    $propBag.serializationWorkerDone = 0

    $jobQueue = New-Object System.Collections.Concurrent.BlockingCollection[psobject](1)
    $serializingQueueSize = $maxIOThreads * 2
    $serializingQueue = New-Object System.Collections.Concurrent.BlockingCollection[psobject]($serializingQueueSize)

    $outputQueue = New-Object System.Collections.Concurrent.BlockingCollection[psobject]($serializationThreads)

    # Create runspace pool to execute scripts from stanzas
    $ioPool = createRunspacePool $maxIOThreads $maxIOThreads $sessionVars
    startIoPool $ioPool $jobQueue $serializingQueue $propBag $logger

    # Create runspace pool for serializing powershell object to modinput XML
    $serializingPool = createRunspacePool $serializationThreads $serializationThreads $sessionVars
    startSerializingPool $serializingPool $serializingQueue $outputQueue $propBag $logger

    # Create runspace pool for scheduler to accept cron jobs which are due
    $schedPool = createRunspacePool 1 1 $sessionVars
    startScheduler $schedPool $waitForCronJobFuncName $params $jobQueue $propBag $logger

    logInfo "ioThreads: $maxIOThreads" $logger
    logInfo "serializationThreads: $serializationThreads" $logger

    # Main thread which print modinput XML to stdout
    waitAndPrintModinputData $outputQueue $logger
}

function waitCronEvents($params, $logger)
{
    return doWaitCronEvents $params.handles $params.propBag $logger
}

# Schedules and executes jobs if number of stanzas is less than 63
# Create array of timer events. The events are signalled from splunk-powershell.exe
function scheduleJobs($consts, $stanzas, $propBag, $logger)
{
    $handles = @()
    $hmap = @{}

    $hShutdownEvent = createShutdownEvent $propBag.tag

    # First handle is shutdown event handle
    $handles += $hShutdownEvent
    $sCnt = 0

    # use 1-level system to schedule scripts
    # create array of event handles $handles and store event handles starting
    # from index 1. Index 0 is reserved for shutdown event handle
    foreach($stanza in $stanzas) {
        # timer event to wait for each stanza
        $timerEvent = getTimerEventName  $propBag.tag $stanza;
        logDebug "Timer event name: $timerEvent" $logger
        $h =createTimerEvent $propBag.tag $stanza
        $hmap.$h = $sCnt;

        logDebug "Adding handle: $h" $logger
        $handles+=$h

        $sCnt = $sCnt +1
    }

    $params = @{
        consts = $consts
        handles = $handles
        hmap = $hmap
        stanzas = $stanzas
        propBag = $propBag
    }
    doScheduleJobs "waitCronEvents" $params $logger
}

function waitCronEventGroups($params, $logger)
{
    return doWaitCronEventGroups $params.handles $params.hmap $params.stanzaHandles $params.propBag $logger
}

# Schedules and executes jobs if number of stanzas is grater than 63
# Create 2-D array of timer events. The events are signalled from splunk-powershell.exe
function scheduleEventGroupJobs($consts, $stanzas, $propBag, $logger)
{
    # contains handles for event groups
    $handles = @()
    # 2-D hash map to store event handles for each stanza : $stanzaHandles[eventGroupId][stanzaId]
    $stanzaHandles = @{}
    # hash map with key of event handle and value of stanza index
    $hmap = @{}

    $hShutdownEvent = createShutdownEvent $propBag.tag
    # First handle is shutdown event handle
    $handles += $hShutdownEvent
    $launched = 0
    $sCnt = 0

    # Use 2-level system to schedule jobs.
    # Partition events into event groups 64 events max and use separate events
    # for each event group. Populate $handles with event group handles.
    # Use $stanzaHandles[eventGroupId][stanzaId] to store event handles for each script
    # First wait on $handles to find out signalled event group,
    # then use its index to listen on array of event handles
    foreach($stanza in $stanzas)
    {
        # timer event to wait for each stanza
        $timerEvent = getTimerEventName  $propBag.tag $stanza;
        logDebug "Timer event name: $timerEvent" $logger
        $h = createTimerEvent $propBag.tag $stanza
        $hmap.$h = $sCnt;

        if($stanzaHandles[$stanza.eventGroup[0]] -eq $null) {
            # initialize group event handle
            # group event handle is a counting semaphore to keep track of
            # multiple events signalled in the same event group
            $grpEvent = getEventGroupName  $propBag.tag $stanza;
            logDebug "Group event name: $grpEvent" $logger
            $hSem = createGroupEvent $propBag.tag $stanza
            if($hSem -eq 0) {
                logError "Failed to create group event: $grpEvent" $logger
                return
            }
            $handles+=$hSem
            logDebug ("Created group event: $grpEvent " + $stanza.eventGroup[0] + " hSem: $hSem") $logger

            # create array of handles to contain handles for individual stanzas
            $stanzaHandles[$stanza.eventGroup[0]] = @()
        }

        # make assumption here that all stanzas have increasing indexes
        $stanzaHandles[$stanza.eventGroup[0]] += $h

        $sCnt = $sCnt +1
    }

    $params = @{
        consts = $consts
        handles = $handles
        hmap = $hmap
        stanzaHandles = $stanzaHandles
        stanzas = $stanzas
        propBag = $propBag
    }
    doScheduleJobs "waitCronEventGroups" $params $logger
}

# Create runspace pool used to execute scripts from stanzas
# add to it global shared variables
function createRunspacePool($minRunspace, $maxRunspace, [hashtable]$sessionVars)
{
    $sessionstate = [System.Management.Automation.Runspaces.InitialSessionState]::CreateDefault()

    foreach($key in $sessionVars.Keys) {
        $sessionVar = New-Object System.Management.Automation.Runspaces.SessionStateVariableEntry($key, $sessionVars[$key], $null)
        $sessionstate.Variables.Add($sessionVar)
    }

    $runspacePool = [RunspaceFactory]::CreateRunspacePool($minRunspace, $maxRunspace, $sessionstate, $Host)

    # default apartment model used by ps3
    $runspacePool.ApartmentState = "STA"

    $runspacePool.Open()
    return $runspacePool
}

#
# Cleans up powershell instances for finished scripts
# Take a script from runspaceCollection and calls EndInvoke() and Dipose() on it
#
$disposerScriptBlock = {

. $propBag.modPath

    logInfo "Enter disposer" $logger

    $runspaceCollection = $propBag.runspaceCollection

    # Loop through all runspaces in runspaceCollection, dispose runspaces
    # which are completed
    while(-not $propBag.shutdown) {
        $disposedNow = 0

        [void]$propBag.mutantDisposer.WaitOne()

        foreach ($Runspace in $runspaceCollection.ToArray()) {
            if ($Runspace.Runspace.IsCompleted -eq $True) {
                logInfo "disposing $Runspace.Tag runspace" $logger
                try {
                    [void]$Runspace.PowerShell.EndInvoke($Runspace.Runspace)
                } catch {
                    logError "PowerShell.EndInvoke() failed: $_" $logger
                }

                [void]$Runspace.PowerShell.Dispose()
                [void]$runspaceCollection.Remove($Runspace)
                $disposedNow = $disposedNow + 1
            }
        }

        [void]$propBag.mutantDisposer.ReleaseMutex()

        if($disposedNow -eq 0) {
            start-sleep -m $propBag.processCompletionCheckInterval
        } else {
            logInfo "disposed $disposedNow runspaces" $logger
        }
    }

    logInfo "Exit disposer" $logger
}

# Create and run Powershell runspace disposer in a separate thread
function createPsDisposer([hashtable]$propBag, $logger)
{
    $sessionVars = @{
        propBag = $propBag
        logger = $logger
    }
    $disposerPool = createRunspacePool 1 1 $sessionVars

    $ps1 = [powershell]::Create()
    $ps1.RunspacePool = $disposerPool

    [void]$ps1.AddScript($disposerScriptBlock)

    $s = [hashtable]::Synchronized(@{})
    $s.Runspace = $ps1.BeginInvoke()
    $s.Powershell = $ps1
    return $s
}

function waitAndPrintModinputData($outputQueue, $logger)
{
    [Console]::WriteLine("<stream>")

    $tryMilliseconds = 10000
    while (1) {
        $data = $null
        if ($outputQueue.TryTake([ref] $data, $tryMilliseconds) -eq $False) {
            continue
        }

        if ($null -eq $data) {
            logInfo "main thread going to exit" $logger
            break
        }

        [Console]::WriteLine($data)
    }

    [Console]::WriteLine("</stream>")
}
