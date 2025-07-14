' VMware support script, VBscript version
'  Collects various configuration and log files
'  for use when troubleshooting the VMware Workstation
'  or the VMware GSX Server

Option Explicit
' On Error Resume Next

Const HKLM = &H80000002
Const COMMON_APPDATA = &H23&
Const USER_APPDATA = &H1A&
Const PROGRAM_FILES = &H26&
Const WINDOWS_DIR = &H24&

Const SUPPORT_URL = "http://www.vmware.com/info?id=7"


' Cannot split the string onto another line. If split, it results in a
' compilation error. Hence the misalignment.
Const ONE_INSTANCE_ONLY = _
"Please make sure only one instance of vm-support.vbs is running at a time."

Dim quietMode, outputFile, outputFolder, collectUILogs, collectLogsForVMs

' Convert and quote a string
Function Quote(strin)
    Dim siz, i, s
    siz = Len(strin)
    For i=1 to siz
        s = s & Chr(Asc(Mid(strin, i, 1)))
    Next
    Quote = Chr(34) & s & Chr(34)
End Function

Function NeedQuote(strin)
    Dim siz, i
    siz = Len(strin)
    For i=1 to siz
        If Asc(Mid(strin, i, 1)) = 32 Then
            NeedQuote = True
            Exit Function
        End If
    Next
    NeedQuote = False
End Function

Function FormatArguments
    Dim s, arg
    s = ""
    For Each arg In Wscript.Arguments
        If NeedQuote(arg) Then
            s = s & " " & Quote(arg)
        Else
            s = s & " " & arg
        End If
    Next
    FormatArguments = s
End Function

Function Timestamp
    Dim t
    t = Now
    Timestamp = Year(t) & "-" _
                & Right("0" & Month(t), 2) & "-" _
                & Right("0" & Day(t), 2) & "-" _
                & Right("0" & Hour(t), 2) & "-" _
                & Right("0" & Minute(t), 2)
End Function

Class VMsupport

    Private tmpdir, vmtmpdir, workdir
    Private AppData, UserData, SysTemp, Username, ProgFiles, Minidump, SysTemp_VmwareSys, AllUsersProfile
    Private versionInfo, majorVersion, minorVersion
    Private archVersion
    Private osVersion
    Private WindowsDir
    Private Fso, Wsh, RegObj
    Private zipExe
    Private CollectStateLogs
    Private VMList

    Private Sub Class_Initialize()
        Dim sh, desktop, objShell, wshNetwork, objWMI, colItems, objItem

        On Error Resume Next

        Set RegObj=GetObject("winmgmts:{impersonationLevel=impersonate}!\\" _
                     & ".\root\default:StdRegProv")
        Set objWMI = GetObject("winmgmts:" _
             & "{impersonationLevel=impersonate}!\\.\root\cimv2")
        Set colItems = objWMI.ExecQuery("SELECT * FROM Win32_OperatingSystem",,48)

        'Getting the version number for the OS (could be used later)
        For Each objItem in colItems
        osVersion=objItem.Version
        Next
        'Spliting the OS version into major minor and service pack if needed in future
        versionInfo = Split(osVersion, ".")
        majorVersion = CInt(versionInfo(0))
        minorVersion = CInt(versionInfo(1))
        'AddressWidth parameter in Win32_Processor class query
        'for finding if OS is 64bit or 32bit
        archVersion = GetObject("winmgmts:root\cimv2:" & _
                                "Win32_Processor='cpu0'").AddressWidth
        Set Fso = CreateObject("Scripting.FileSystemObject")

        set Wsh = WScript.CreateObject("WScript.Shell")
        set wshNetwork = CreateObject("WScript.Network")
        Username = wshNetwork.Username
        desktop = Wsh.SpecialFolders("Desktop")
        tmpdir = Wsh.Environment("Process").Item("Temp")
        SysTemp = Wsh.Environment("Process").Item("WINDIR") & "\Temp"
        SysTemp_VmwareSys = SysTemp & "\vmware-system"
        Minidump = Wsh.Environment("Process").Item("WINDIR") & "\Minidump"
        AllUsersProfile = Wsh.Environment("Process").Item("ALLUSERSPROFILE")
        If outputFolder = "" Then
            vmtmpdir = tmpdir & "\vmware-support"
        Else
            vmtmpdir = outputFolder
        End If
        if not Fso.FolderExists(vmtmpdir) then
            Fso.CreateFolder(vmtmpdir)
        end if
        workdir = vmtmpdir & "\vmsupport-" & Timestamp
        If Fso.FolderExists(workdir) Then
            Fso.DeleteFolder workdir, True
            If Err.number <> 0 Then
                If Not quietMode Then
                    WriteLine ""
                    WriteLine " Could not delete folder " & workdir & ". " & _
                              ONE_INSTANCE_ONLY
                End If
                WScript.Quit(0)
            End If
        End If
        Set VMList = CreateObject("Scripting.Dictionary")
        If Err.number <> 0 Then
            If Not quietMode Then
                WriteLine ""
                WriteLine " Could not create the scripting dictionary. " & _
                          ONE_INSTANCE_ONLY
            End If
            WScript.Quit(0)
        End If
        Fso.CreateFolder(workdir)
        Fso.CreateFolder(workdir & "\Misc")
        Fso.CreateFolder(workdir & "\Dumps")
        Fso.CreateFolder(workdir & "\VM")
        Fso.CreateFolder(workdir & "\TEMP")
        Fso.CreateFolder(workdir & "\Global_Config")
        Fso.CreateFolder(workdir & "\SYSTEMP")
        Fso.CreateFolder(workdir & "\SYSTEMP\vmware-system")
        Fso.CreateFolder(workdir & "\MiniDump")
        Fso.CreateFolder(workdir & "\DxDiag")
        Set objShell = CreateObject("Shell.Application")
        AppData = objShell.Namespace(COMMON_APPDATA).Self.Path
        UserData = objShell.Namespace(USER_APPDATA).Self.Path
        WindowsDir = objShell.Namespace(WINDOWS_DIR).Self.Path
        ProgFiles = objShell.Namespace(PROGRAM_FILES).Self.Path
        zipExe = """" & Left(WScript.ScriptFullName, Len(WScript.ScriptFullName) - _
        Len(WScript.ScriptName)) & "zip.exe"""
    End Sub

    Sub DumpKey(DefKey, Path, filename)
        Dim f1

        On Error Resume Next

        Set f1 = fso.CreateTextFile(filename, True, True)
        If Err.number <> 0 Then
            If Not quietMode Then
                WriteLine ""
                WriteLine "Could not create text file " & filename & ". " & _
                          ONE_INSTANCE_ONLY
            End If
            WScript.Quit(0)
        End If
        EnumerateKey DefKey, Path, f1
        f1.Close
    End Sub

    ' Recursively enumerate registry and write it to a file.
    Sub EnumerateKey(DefKey, Path, OutFile)
        dim Keys, Names, types, i, j, value
        OutFile.WriteLine("[" & Path & "]")
        RegObj.EnumValues DefKey, Path, Names, Types
        if not IsNull(Names) and not IsNull(Types) Then
            for i = lbound(types) to ubound(types)
                select case types(i)
                    case 1
                        RegObj.GetStringValue defkey, path, names(i), value
                        If not isnull(names(i)) or not isnull(value) then
                            OutFile.WriteLine  names(i) & "=" & Quote(value)
                        end if
                    case 2
                        RegObj.GetExpandedStringValue defkey, path, names(i), _
                                              value
                        if not isnull(names(i)) or not isnull(value) then
                            OutFile.WriteLine Quote(names(i)) & "=expand:" & _
                                              Quote(value)
                        end if
                    case 3
                        RegObj.GetBinaryValue defkey, path, names(i), value
                        for j = lbound(value) to ubound(value)
                            value(j) = hex(cint(value(j)))
                        next
                        if not isnull(names(i)) or not isnull(value) then
                            OutFile.WriteLine Quote(names(i)) &"=hex:"& _
                                              join(value, ",")
                        end if
                    case 4
                        RegObj.GetDWordValue defkey, path, names(i), value
                        if not isnull(names(i)) or value then
                            OutFile.WriteLine Quote(names(i)) & "=dword:" & _
                                              hex(value)
                        end if
                end select
            next
        end if

        OutFile.WriteLine
        RegObj.EnumKey HKLM, Path, Keys
        Dim SubKey, NewPath
        If not IsNull(Keys) Then
            For Each SubKey In Keys
                NewPath = Path & "\" & SubKey
                EnumerateKey DefKey, NewPath,OutFile
            Next
        End if
    End Sub

    ' Run a command and save the output to a file
    Sub RunCmd(cmd, outfile)
        Dim f1, run, output

        On Error Resume Next

        Set f1 = fso.CreateTextFile(outfile, True, True)
        If Err.number <> 0 Then
            If Not quietMode Then
                WriteLine ""
                WriteLine "Could not create text file " & outfile & ". " & _
                          ONE_INSTANCE_ONLY
              End If
              WScript.Quit(0)
        End If
        set run = Wsh.exec(cmd)
        output = run.stdout.readall
        f1.Write output
        f1.Close
    End Sub

    Sub CopyConfig()
        On Error Resume Next
        Dim myFolders, folder
        Set myFolders = fso.GetFolder(AppData & "\VMware").SubFolders
        For Each folder in myFolders
            folder = Fso.GetFileName(folder)
            If LCase(folder) <> "vmware ace" Then
                CopyFolderExceptVMs AppData & "\VMware\" & folder, _
                                    workdir & "\Global_Config" & "\" & folder
            End if
        Next

        Fso.CopyFolder UserData & "\VMware", workdir & "\Current_User"
        ' The UI Log
        Fso.CopyFile tmpdir & "\vmware-" & Username & "\vmware*.log", _
                     workdir & "\Temp\"
        ' The Installer Logs
        Fso.CopyFile SysTemp & "\vpxainst.log", workdir & "\SYSTEMP\"
        Fso.CopyFile SysTemp & "\vpxauninst.log", workdir & "\SYSTEMP\"
        Fso.CopyFile SysTemp & "\vim-vpxa-msi.log", workdir & "\SYSTEMP\"
        Fso.CopyFile SysTemp & "\vminst.log", workdir & "\SYSTEMP\"
        Fso.CopyFile tmpdir & "\vm*.log", workdir & "\Temp\"
        Fso.CopyFile  SysTemp & "\vmware*.log", workdir & "\SYSTEMP\"
        If (Fso.FileExists(WindowsDir & "\setupapi.log")) Then
           Fso.CopyFile WindowsDir & "\setupapi.log" , workdir & "\SYSTEMP\"
        End If
        If (Fso.FileExists(WindowsDir & "\inf\setupapi.dev.log")) Then
           Fso.CopyFile WindowsDir & "\inf\setupapi.dev.log" , workdir & "\SYSTEMP\"
        End If
        If (Fso.FileExists(WindowsDir & "\inf\setupapi.offline.log")) Then
           Fso.CopyFile WindowsDir & "\inf\setupapi.offline.log" , workdir & "\SYSTEMP\"
        End If
        If (Fso.FileExists(WindowsDir & "\inf\setupapi.app.log")) Then
           Fso.CopyFile WindowsDir & "\inf\setupapi.app.log" , workdir & "\SYSTEMP\"
        End If
        On Error Goto 0
    End Sub

    ' Copy dump files
    Sub CopyDumpFiles()
        On Error Resume Next
        Dim appDir
        appDir = GetUserProfileDirectory("Default User") & "\Application Data"
        Fso.CopyFile appDir & "\VMware\*.dmp", workdir & "\Dumps\"
        appDir = GetUserProfileDirectory("Default User") & _
           "\Local Settings\Application Data"
        Fso.CopyFile appDir & "\VMware\*.dmp", workdir & "\Dumps\"
        appDir = GetUserProfileDirectory("LocalService") & "\Application Data"
        Fso.CopyFile appDir & "\VMware\*.dmp", workdir & "\Dumps\"
        appDir = GetUserProfileDirectory("NetworkService") & "\Application Data"
        Fso.CopyFile appDir & "\VMware\*.dmp", workdir & "\Dumps\"
        appDir = GetUserProfileDirectory("NetworkService") & _
           "\Local Settings\Application Data"
        Fso.CopyFile appDir & "\VMware\*.dmp", workdir & "\Dumps\"
    End Sub

    Sub CopyEventLogs()
        CopyLog "Application", workdir & "\Misc\"
        CopyLog "System", workdir & "\Misc\"
        CopyLog "Security", workdir & "\Misc\"
    End Sub

    ' Delete files with sensitive data
    ' Currently we delete the SSL folder to avoid collecting
    ' the private or public keys.
    Sub PurgeFiles()
        On Error Resume Next
        Fso.DeleteFolder workdir & "\Global_Config\VMware Server\SSL"
    End Sub

    ' Copy the specified system event log to the specified directory
    Sub CopyLog(logname, directory)
        ' non-admin users would lack permissions
        On Error Resume Next
        Dim query1, query2, logfileset, logfileobj

        query1 = "winmgmts:{impersonationLevel=impersonate," &_
           "(Backup,Security)}!\\.\root\cimv2"
        query2 = "select * from Win32_NTEventLogFile where " &_
           "LogfileName='" & logname & "'"

        Set logfileset = GetObject(query1).ExecQuery(query2)

        For Each logfileobj in logfileset
           logfileobj.BackupEventLog(directory & logname & "-log.evt")
        Next
        On Error Goto 0
    End Sub

    Sub CopyMinidump()
        On Error Resume Next
        Dim dumpFolder, myDumpFiles, dumpFile
        Dim lastModTime1, lastModFile1 ' File modified last but one
        Dim lastModTime2, lastModFile2 ' File modified last

        lastModTime1 = 0
        lastModTime2 = 0
        lastModFile1 = lastModFile2 = ""

        Set dumpFolder = fso.GetFolder(Minidump)
        Set myDumpFiles = dumpFolder.Files
        For Each dumpFile in myDumpFiles
            If UCase(fso.GetExtensionName(dumpFile)) = "DMP" Then
                If dumpFile.LastModified > lastModified2 Then
                    lastModFile1 = lastModFile2
                    lastModTime1 = lastModTime2
                    lastModFile2 = dumpFile.Name
                    lastModTime2 = dumpFile.LastModified
                ElseIf dumpFile.LastModified > lastModified1 Then
                    lastModFile1 = dumpFile.Name
                    lastModTime1 = dumpFile.LastModified
                End If
            End If
        Next

        If lastModFile1 <> "" Then
            Fso.CopyFile  MiniDump & "\" & lastModFile1 , workdir & "\Minidump\"
            If Not quietMode Then Write "."
        End If
        If lastModFile2 <> "" Then
            Fso.CopyFile  MiniDump & "\" & lastModFile2 , workdir & "\Minidump\"
            If Not quietMode Then Write "."
        End If
        On Error Goto 0
    End Sub

    Sub CopyVmwareSystemFiles()
        On Error Resume Next
        Dim dumpFolder, myDumpFiles, dumpFile

        Set dumpFolder = fso.GetFolder(SysTemp_VmwareSys)
        Set myDumpFiles = dumpFolder.Files
        For Each dumpFile in myDumpFiles
            Fso.CopyFile  SysTemp_VmwareSys & "\" & dumpFile.Name , _
                workdir & "\SYSTEMP\vmware-system\"
            If Not quietMode Then Write "."
        Next
        On Error Goto 0
    End Sub


    ' Return a list of all matched objects
    Function ReFindAll(regexp, data)
        Dim re
        Set re = New RegExp
        re.Pattern = regexp
        re.IgnoreCase = True
        re.Global = True
        Set ReFindAll = re.Execute(data)
    End Function

    Function ReMatch(regexp, data)
        Dim re
        Set re = New RegExp
        re.Pattern = regexp
        re.IgnoreCase = True
        Set ReMatch = re.Match(data)
    End Function

    ' Unquote the string.
    Function GetFileName(ByVal data)
        GetFileName = split(data, Chr(34), 3)(1)
    End Function

   ' Return the path to the user profile directory of the specified user
    Function GetUserProfileDirectory(userName)
        Dim strKeyPath, strValueName, strValue
        strKeyPath = "SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList"
        strValueName = "ProfilesDirectory"
        RegObj.GetExpandedStringValue HKLM, strKeyPath, strValueName, strValue
        If not IsNull(strValue) Then
            strValue = strValue & "\" & userName
        End if
        GetUserProfileDirectory = strValue
     End Function

     ' Search for all VMs registered with hostd and copy the contents by calling CopyVM
     Sub CopyHostdVMs()
        Dim xmlDoc, vms, i, inventoryFile, vmxFile
        Set xmlDoc = CreateObject("Microsoft.XMLDOM")
        inventoryFile = AppData & "\VMware\VMware Server\hostd\vmInventory.xml"
        xmlDoc.Load(inventoryFile)
        xmlDoc.async = false
        Set vms = xmlDoc.GetElementsByTagName("vmxCfgPath")
        For i = 0 to vms.length - 1
            vmxFile = vms(i).text
            If Fso.FileExists(vmxFile) Then
                CopyVM i, vmxFile
            End if
        Next
    End Sub

    ' Search only one level of folders for vmx files.
    Sub FindAllFoldersWithVMX(directory)
        On Error Resume Next
        Dim subfolder, file
        For Each subfolder in fso.GetFolder(directory).SubFolders
            file = subfolder & "\v.vmx"
            If not VMList.Exists(file) Then
                VMList.add file, ""
            End If
        Next
    End Sub

    ' Search for all VMs. The real work is done in CopyVM
    Sub CopyVMs()
        Dim file, data, m, i, packagepath, folder, subfolders, subfolder
        If Wscript.Arguments.Count > 0 Then
            If (collectUILogs) Then
                Exit Sub
            End If
        End If

        If (collectLogsForVMs) Then
            For i = 0 To Wscript.Arguments.Count - 1
                If Wscript.Arguments(i) = "-v" _
                   And i + 1 < Wscript.Arguments.Count _
                Then
                    Dim files
                    files = Split(Wscript.Arguments(i + 1), "|")
                    For Each file in files
                        file = Trim(file)
                        If InStrRev(file, ".vmx", -1, vbTextCompare) _
                           <> (Len(file) - 3) _
                        Then
                            'Looks like we got the vmx file path
                            file = file & "\v.vmx"
                        End If
                        If Not VMList.Exists(file) Then
                            VMList.add file, ""
                        End If
                    Next
                End If
            Next
        Else
            file = UserData & "\VMware\preferences.ini"
            If Fso.FileExists(file) Then
                data = Fso.OpenTextFile(file).ReadAll
                For Each m in ReFindAll(".*openedObj\d+\.file\s*=.*\n", data)
                    file = GetFileName(m.value)
                    IF not VMList.Exists(file) Then
                        VMList.add file, ""
                    End IF
                Next
            End If
            file = UserData & "\VMware\inventory.vmls"
            If Fso.FileExists(file) Then
                data = Fso.OpenTextFile(file).ReadAll
                For Each m in ReFindAll("vmlist\d+\.config\s*=.*\n", data)
                    file = GetFileName(m.value)
                    If not VMList.Exists(file) Then
                        VMList.add file, ""
                    End If
                Next
            End If
            file = UserData & "\VMware\Virtual Machines.vmls"
            If Fso.FileExists(file) Then
                data = Fso.OpenTextFile(file).ReadAll
                For Each m in ReFindAll("vmlist\d+\.config\s*=.*\n", data)
                    file = GetFileName(m.value)
                    If not VMList.Exists(file) Then
                        VMList.add file, ""
                    End If
                Next
            End If
            ' Collect ACE 1.0 vms
            RegObj.GetStringValue HKLM, _
                "SOFTWARE\VMware, Inc.\VMware ACE", _
                "PackagePath", packagepath
            If not isNull(packagepath) _
               and Fso.FolderExists(packagepath & "Virtual Machines\") _
            Then
                Set folder = Fso.GetFolder(packagepath & "Virtual Machines\")
                FindAllFoldersWithVMX(folder)
            End If
            ' Collect ACE 2.0 deployed VMs
            FindAllFoldersWithVMX(AppData & "\VMware\VMware ACE")
        End If

        CollectStateLogs = False
        For i = 0 To Wscript.Arguments.Count - 1
            If Wscript.Arguments(i) = "-s" Then
                CollectStateLogs = True
                Exit For
            End If
        Next

        VMList = VMList.Keys
        For i = Lbound(VMList) to Ubound(VMList)
            If Fso.FileExists(VMList(i)) _
               OR ContainsVmxFile(Fso.GetParentFolderName(VMList(i))) _
            Then
                CopyVM i, VMList(i)
            End If
        Next

        CopyHostdVMs
    End Sub

    Sub CopyFolderExceptVMs(source, dest)
        Dim file, folder, myFolders, tmpf
        ' create dest if it does not exist
        If not Fso.FolderExists(dest) Then
            Fso.CreateFolder dest
        End If
        ' Copy each file in the directory
        For Each file in Fso.GetFolder(source).Files
            tmpf = LCase(file)
            ' Let's keep this as a whitelist for now.
            ' .gz added to collect the zipped hostd files
            If right(tmpf,4) = ".log" OR _
               right(tmpf,3) = ".gz" OR _
               right(tmpf,4) = ".ini" OR _
               right(tmpf,4) = ".xml" _
            Then
                Fso.CopyFile file, dest & "\"
            End If
        Next

        If Not quietMode Then Write "."
        ' Copy each directory in this directory
        Set myFolders = fso.GetFolder(source).SubFolders
        For Each folder in myFolders
            folder = Fso.GetFileName(folder)
            If LCase(folder) <> "virtual machines" Then
                CopyFolderExceptVMs source & "\" & folder, _
                                    dest & "\" & folder
            End If
        Next
    End Sub

    ' Save files less than 30K or the log file.
    ' Monitor logs will be in a subdirectory eventually.
    Sub CopyVM(index, vmx)
        Dim src, dst, f, i, baseDst, absPath, pos
        Dim myFld, folder

        On Error Resume Next

        src = Fso.GetParentFolderName(vmx)
        ' Set the destination dir to be the VM folder name.
        ' If there are more than one VMs with the same folder name
        ' we add a "-1", "-2" etc as the suffix.
        dst = workdir & "\VM\" & Fso.GetFolder(src).Name
        baseDst = dst
        i = 1
        While Fso.FolderExists(dst)
            dst = baseDst & "-" & i
            i = i + 1
        Wend
        dst = dst & "\"
        Fso.CreateFolder(dst)
        For Each f in fso.GetFolder(src).Files
            f = LCase(f)
            absPath = f
            ' get file name from absolute path
            pos = InStrRev(f, "\")
            f = right(f, Len(f) - pos)
            If Fso.GetFile(absPath).Size < 30000 OR right(f,5)=".vmpl" _
               OR left(f,5)="stats" OR left(f,4)="gmon" OR left(f,10)="callstacks"   _
               OR left(f,7)="samples" OR left(f,6)="status" _
            Then
                Fso.CopyFile absPath, dst
            Else
                If right(f,4)=".log" Then
                    If CollectStateLogs=True Then
                        Fso.CopyFile absPath, dst
                    Else
                        If InStr(f, "state")=0 Then
                             Fso.CopyFile absPath, dst
                        End If
                    End If
                ElseIf right(f,4)=".dmp" Then
                    Fso.CopyFile f, dst
                End If
            End If
        Next

        Set myFld = Fso.GetFolder(src).SubFolders
        For Each folder in myFld
             Dim tmpf
             folder = Fso.GetFileName(folder)
             tmpf = LCase(folder)
             If right(tmpf,5) = "stats" Then
                 Fso.CopyFolder src & "\" & folder, dst & "\stats"
             End If
        Next

        RunCmd "cacls """ & src & """\*.*", dst & "cacls.txt"

        Set f = fso.CreateTextFile(dst & "vmxpath.txt", True, True)
        If Err.number <> 0 Then
            If Not quietMode Then
                WriteLine ""
                WriteLine "Could not create text file vmxpath.txt. " & _
                          ONE_INSTANCE_ONLY
            End If
            WScript.Quit(0)
        End If
        f.WriteLine vmx
        f.Close

        If Not quietMode Then Write "."
    End Sub

    ' returns TRUE if there's a VMX file in the given directory
    Function ContainsVmxFile(path)
        Dim f
        ContainsVmxFile = FALSE
        If not Fso.FolderExists(path) Then
            Exit Function
        End If
        For Each f in fso.GetFolder(path).Files
            f = LCase(f)
            If right(f,4)=".vmx" Then
                ContainsVmxFile = TRUE
                Exit Function
            End If
        Next
    End Function

    ' Save the MSinfo report, this takes a while and hence not saving text.
    Sub MSInfo
        Dim msinfo
        msinfo = Wsh.RegRead("HKLM\SOFTWARE\Microsoft\Shared Tools\MSInfo\Path")
        Wsh.Run Quote(msinfo) & " /nfo " & workdir & "\Misc\MSinfo.nfo", 0, True
        If Not quietMode Then Write "."
    End Sub

    Sub Service
        Dim fp, wmi, s, Services, i

        On Error Resume Next

        Set fp = Fso.CreateTextFile(workdir & "\Misc\Service.txt", _
                                    True, True)
        If Err.number <> 0 Then
            If Not quietMode Then
                WriteLine ""
                WriteLine "Could not create text file Service.txt. " & _
                          ONE_INSTANCE_ONLY
            End If
            WScript.Quit(0)
        End If
        Set wmi = GetObject("winmgmts:" _
            & "{impersonationLevel=impersonate}!\\.\root\cimv2")
        Set Services = wmi.ExecQuery _
                ("SELECT * FROM Win32_Service")
        For Each s in Services
            fp.WriteLine "System Name: " & s.SystemName
            fp.WriteLine "Service Name: " & s.Name
            fp.WriteLine "Service Type: " & s.ServiceType
            fp.WriteLine "Service State: " & s.State
            fp.WriteLine "ExitCode: " & s.ExitCode
            fp.WriteLine "Process ID: " & s.ProcessID
            fp.WriteLine "Accept Pause: " & s.AcceptPause
            fp.WriteLine "Accept Stop: " & s.AcceptStop
            fp.WriteLine "Caption: " & s.Caption
            fp.WriteLine "Description: " & s.Description
            fp.WriteLine "Desktop Interact: " & s.DesktopInteract
            fp.WriteLine "Display Name: " & s.DisplayName
            fp.WriteLine "Error Control: " & s.ErrorControl
            fp.WriteLine "Path Name: " & s.PathName
            fp.WriteLine "Started: " & s.Started
            fp.WriteLine "StartMode: " & s.StartMode
            fp.WriteLine "StartName: " & s.StartName
            fp.Writeline

            i=i+1
            if (i mod 4) = 0 And Not quietMode then Write "."
        Next
        fp.Close
    End Sub

    Sub VMwareUser
        Dim accounts, user, localhost, vmuser
        localhost = CreateObject("Wscript.Network").ComputerName
        Set vmuser = GetObject("WinNT://" & localhost & "/__vmware_user__")
    End Sub

    Sub BootIni
        Dim i, bootdrive, bootini
        For i=0 to 23
            bootdrive = Chr(Asc("C")+i)
            bootini = bootdrive & ":\boot.ini"
            If Fso.FileExists(bootini) Then
                On Error Resume Next
                Dim bootinidest, f
                bootinidest = workdir & "\Misc\" & bootdrive & "_boot.ini"
                Fso.CopyFile  bootini, bootinidest

                ' Unset the hidden and system bits if set.
                Set f = Fso.GetFile(bootinidest)
                If f.attributes and 4 Then
                    f.attributes = f.attributes - 4
                End If
                If f.attributes and 2 Then
                    f.attributes = f.attributes - 2
                End If
                ' GetFile would fail if the boot.ini was not copied
                On Error Goto 0
                If bootdrive = "C" Then
                    Exit For
                End If
            End If
        Next
    End Sub

    Sub Generate()
        If Not quietMode Then
            WriteLine "Collecting information needed for support. " & _
            "This may take several minutes."
        End If

        Set Fso = CreateObject("Scripting.FileSystemObject")

        If Not quietMode Then Write "  Registry "
        DumpKey HKLM, "SOFTWARE\VMware, Inc.", workdir & "\Misc\vmware_reg.txt"
        If Not quietMode Then Write ".."
        DumpKey HKLM, "SOFTWARE\Microsoft\Windows NT\CurrentVersion\NetworkCards", _
        workdir & "\Misc\networkcards_reg.txt"
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  DxDiag Data ."
        Wsh.Run("dxdiag /t " & workdir & "\DxDiag\DxDiag.txt")

        'Version Check for Windows 8 current version added
        ' to be modified when /64bit option is not supported later on too
        If archVersion = 64 And (majorVersion <= 5 or (majorVersion = 6 _
                                And minorVersion < 2)) Then
            Wsh.Run("dxdiag /64bit /t" & workdir & "\DxDiag\DxDiag-64Bit.txt")
        End if
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  Driverquery ."
        'Driverquery was first introduced in Windows XP.
        If majorVersion > 5 Or (majorVersion = 5 And minorVersion >= 1) Then
            RunCmd "Driverquery /fo TABLE /V", workdir & "\Misc\Driverquery.txt"
        End if
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  Network Configuration ."
        Fso.CopyFile AppData & "\VMware\vmnet*.*" , workdir & "\Misc"
        RunCmd "ipconfig /all", workdir & "\Misc\ipconfig.txt"
        RunCmd "route print", workdir & "\Misc\route.txt"
        If Not quietMode Then Write ".."
        RunCmd "netstat -aens", workdir & "\Misc\netstat.txt"
        If Not quietMode Then Write ".."
        RunCmd "netsh winsock show catalog", workdir & "\Misc\winsock_catalog.txt"
        If Not quietMode Then WriteLine ".."

        If Not quietMode Then Write "  Startup Settings ."
        BootIni
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  VMware Configuration ."
        CopyConfig
        CopyDumpFiles
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  Virtual Machines "
        CopyVMs
        If Not quietMode Then WriteLine ""

        If Not quietMode Then Write "  Services "
        Service
        If Not quietMode Then WriteLine ""

        If Not quietMode Then Write "  Dumps ."
        CopyMinidump
        CopyVmwareSystemFiles
        If Not quietMode Then WriteLine ""

        If Not quietMode Then Write "  System Information ."
        MSInfo
        If Not quietMode Then WriteLine "."

        If Not quietMode Then Write "  Logs ."
        CopyEventLogs
        If Not quietMode Then WriteLine ""

        PurgeFiles

        If Not quietMode Then WriteLine ""

        Dim zipfile
        If outputFile = "" Then
            zipfile = workdir & ".zip"
        Else
            zipfile = outputFile
            If Not LCase(Right(zipfile, 4)) = ".zip" Then
                zipfile = zipfile & ".zip"
            End If
        End If
        If Not quietMode Then WriteLine "Creating zip file..."
        RunCmd zipExe & " -r """ & zipfile & """ " & workdir, tmpDir & "\out.txt"

        If Not quietMode Then WriteLine ""

        If Not Fso.FileExists(zipfile) Then
            WriteLine "There was an error creating the zip file."
            WriteLine "If a file changed while reading, " &_
                      "please run this script again."
            WriteLine ""
        Else
            If Not quietMode Then
                WriteLine "Done!"
                WriteLine ""
            End If
            WriteLine "Saved support data to " & zipfile
            If Fso.GetFile(zipfile).size > 10000000 Then
                WriteLine "NOTE: " & zipfile & " is greater than 10 MB. "
                WriteLine "Please do not attach this file when submitting an " &_
                          "incident report. Please contact VMware support for " &_
                          "an ftp site. To file a support incident, go to " &_
                          SUPPORT_URL
            Else
                WriteLine "Please attach this file when submitting an incident " &_
                          "report. To file a support incident, go to " &_
                          SUPPORT_URL
                End If
            If Not quietMode Then WriteLine ""
        End If

        on error resume next
        If Fso.FolderExists(workdir) Then
            Fso.DeleteFolder workdir, true
        End If

        'Open Windows Explorer in the right folder
        If Not quietMode Then Wsh.exec("explorer /n,/select," & zipfile)
        on error goto 0
        If Not quietMode Then WriteLine ""
        If Not quietMode Then WriteLine ""

    End Sub


End class

sub Write (s)
    on error resume next
    Wscript.StdOut.Write s
    on error goto 0
end sub

sub WriteLine (s)
    on error resume next
    Wscript.StdOut.WriteLine s
    on error goto 0
end sub

' If running with Wscript, relaunch with Cscript.
' This way people who double click directly on the script get the console and
' not a barrage of alert boxes.
sub EnsureCscript
    If Not WScript.FullName = WScript.Path & "\cscript.exe" Then
        Dim Shell
        Set Shell = CreateObject("WScript.Shell")
        Shell.Run WScript.Path & "\cscript.exe " & _
            Chr(34) & WScript.ScriptFullName & Chr(34) & _
            " //Nologo " & FormatArguments(), _
            1, False
        WScript.Quit 0
    End If
end sub

Function IsArgsAvail
    Dim args, idx, arg, check
    Set args = WScript.Arguments
    idx = 0
    check = True

    While idx < args.Count
        arg = args(idx)
        Select Case arg
            Case "-q"
                quietMode = True
            Case "-o"
                idx = idx + 1
                If idx = args.Count Then
                    check = False
                Else
                    outputFile = args(idx)
                End If
            Case "-w"
                ' Sets the destination directory.  Handle this flag for
                ' backward compatibility.
                idx = idx + 1
                If idx = args.Count Then
                    check = False
                Else
                    outputFolder = args(idx)
                End If
            Case "-u"
                collectUILogs = True
            Case "-s"
                'go to next argument
            Case "-v"
                idx = idx + 1
                'check if next argument is provided
                If idx = args.Count Then
                    check = False
                Else
                    collectLogsForVMs = True
                End If
            Case "-h"
                check = False
            Case Else
                check = False
        End Select

        If Check = False Then
            IsArgsAvail = False
            Exit Function
        End If

        idx = idx + 1
    Wend
    IsArgsAvail = check
End Function

Sub Usage
    Wscript.Echo "Usage: vm-support.vbs [-q] [-o <output file>] [-s|-u|-v<path>] [-h]"
    Wscript.Echo "  -q               Quiet mode. Do not print any unnecessary information"
    Wscript.Echo "  -o               The filename (including path) to the resulting .zip file"
    Wscript.Echo "  -u               Collect system information and UI logs"
    WriteLine ""
    Wscript.Echo "  -v VMX filename(s) or dir path(s) separated by |"
    Wscript.Echo "                   Collect logs only for the specified VMs"
    Wscript.Echo "                   Example: vm-support.vbs -v ""path1\file1 | path2\file2"""
    WriteLine ""
    Wscript.Echo "  -s               Include state logs to vm-support package"
    WriteLine ""
    Wscript.Echo "  -h               Display this help menu"
    WriteLine ""
    Wscript.Echo " If no options are given, collect logs for all VMs"
    WriteLine ""
    WriteLine "Press 'Enter' to close this window"
    Dim read
    read = Wscript.StdIn.Read(1)
    Wscript.Quit 0
End Sub

' Convert wscript version number if system uses comma as the decimal point.
Dim wversion
wversion = Wscript.Version
if not IsNumeric(wversion) and IsNumeric(Replace(wversion,".",",")) Then
    wversion = CDbl(Replace(wversion,".",","))
End If

If wversion < 5.6 Then
    Wscript.Echo "This vm-support script expects Windows Script Version " & _
                 "5.6 or above"
    Wscript.Echo "Windows Script update can be obtained from:"
    Wscript.Echo "http://www.microsoft.com/downloads/details.aspx" & _
                 "?FamilyId=C717D943-7E4B-4622-86EB-95A22B832CAA&displaylang=en"
    Wscript.quit 0
End If

EnsureCscript

' Parse command line arguments
quietMode = False
outputFile = ""
outputFolder = ""
collectUILogs = False
collectLogsForVMs = False

If Not IsArgsAvail Then
    Call Usage
Else
    If Not quietMode Then
        WriteLine "VMware Support Script"
        WriteLine "Copyright (C) 1998-2014 VMware, Inc."
        WriteLine "Warning: This script will collect most files in the Virtual Machines folder."
        WriteLine "         Move any sensitive information to another folder."
        WriteLine ""
    End If

    Dim info
    Set info = new VMsupport
    info.Generate
End If
