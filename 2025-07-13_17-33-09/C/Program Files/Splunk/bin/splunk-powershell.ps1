# Include external modules
$moduleName = "splunk-powershell-common.ps1"

if ($psversiontable.psversion.Major -gt 5) {
    Set-StrictMode -Version 5
} else {
    Set-StrictMode -Version Latest
}

$ScriptDirectory = Split-Path $MyInvocation.MyCommand.Path
. (Join-Path $ScriptDirectory $moduleName)

#
# Enable logging here.
#
$logError = $True
$logWarn = $True
$logInfo = $True
$logDebug = $False

function help()
{
    write-host "Usage: splunk-powershell.ps1 <SPLUNK_HOME> <tag> "
}

if ($args.Length -lt 2)
{
    $host.ui.WriteErrorLine("Error: Invalid argument")
    help
    exit 1
}

################# main ###########################

# this script is launched with the following command from splunk-powershell.exe:
#  powershell.exe -command  "& {get-content "C:\Users\<user>\AppData\Local\Temp\input<tag>.tmp" | "c:\splunk_build\bin\splunk-powershell.ps1" <splunk_home> <tag>}"

if ($args[0] -eq "-?" -or $args[0] -eq "--?" -or $args[0] -eq "-help" -or $args[0] -eq "--help")
{
    help
    exit 0
}

# Capture all types of exceptions in powershell.
# By default try/catch only works for terminate type of exceptions.
$ErrorActionPreference = "stop"

# logger signature: createLogger <destination> <maxsize> <backups> ErrorOn WarnOn InfoOn DebugOn
$splunkHome = $args[0]
$logger = createLogger `
    ($splunkHome+'\var\log\splunk\splunk-powershell.ps1.log') `
    25000000 `
    5 `
    $logError $logWarn $logInfo $logDebug

logInfo "start splunk-powershell.ps1" $logger

# read input from splunk-powershell.exe
$lines = $input | foreach {$_}
$ret = readInputFile $lines $logger
if ($ret -eq $null) {
    exit 1
}
$consts = $ret[0]
$stanzas = $ret[1]

if ( -not (validateStanza $stanzas $logger)) {
    exit 1
}
logInfo "num of stanzas: $($stanzas.count) discovered" $logger

# Prepare property bag
# It is passed to runspaces
$propBag = [hashtable]::Synchronized(@{})

# mutex to protect runspaceCollection
[bool]$wasCreated = $false
$propBag.mutantDisposer = New-Object System.Threading.Mutex($false, "mutantDisposer", [ref] $wasCreated)
$propBag.runspaceCollection = New-Object System.Collections.ArrayList

$propBag.shutdown = $False
$propBag.modPath = (Join-Path $ScriptDirectory $moduleName)
$propBag.eventSerializationFormat = $stanzas[0]["eventSerializationFormat"]
$propBag.batchSize = 100
$propBag.processCompletionCheckInterval = $stanzas[0]["processCompletionCheckInterval"]

# `tag` is used to uniquely identify events shared between
# splunk-powershell.exe and this script
$propBag.tag = $args[1]

$psDisposer = createPsDisposer $propBag $logger

logInfo "SplunkHome: $($consts.SplunkHome)" $logger
logInfo "SplunkServerName: $($consts.SplunkServerName)" $logger
logInfo "SplunkServerUri: $($consts.SplunkServerUri)" $logger
logInfo "SplunkCheckpointPath: $($consts.SplunkCheckpointPath)" $logger
logInfo "SplunkServerHost: $($consts.SplunkServerHost)" $logger
logInfo "PowerShellMajorVersion: $($psversiontable.psversion.Major)" $logger
logInfo "EventSerializationFormat: $($propBag.eventSerializationFormat)" $logger

$useEventGroups = ($stanzas[0].eventGroup[0] -gt -1)
if($useEventGroups) {
    # Place [void] in front of scheduleEventGroupJobs to avoid objects accidently emitted
    # in this function leak to runspace which caused memory leak
    [void](scheduleEventGroupJobs $consts $stanzas $propBag $logger)
} else {
    # Place [void] in front of scheduleJobs to avoid objects accidently emitted
    # in this function leak to runspace which caused memory leak
    [void](scheduleJobs $consts $stanzas $propBag $logger)
}

$psDisposer.Powershell.EndInvoke($psDisposer.Runspace)
$psDisposer.Powershell.Dispose()

logInfo "end of splunk-powershell.ps1" $logger
