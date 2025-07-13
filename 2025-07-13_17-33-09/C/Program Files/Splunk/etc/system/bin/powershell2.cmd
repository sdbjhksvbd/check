@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Powershell v2 Modular Input^</title^>
echo     ^<description^>Execute PowerShell scripts v2 with parameters as inputs.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-powershell2.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>powershell2^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo             ^</arg^>
echo             ^<arg name="script"^>
echo                 ^<title^>Command or Script Path^</title^>
echo                 ^<description^>A powershell command-line, script, or the full path to a script.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="schedule"^>
echo                 ^<title^>Cron Schedule^</title^>
echo                 ^<description^>A cron string specifying the schedule for execution: minutes hours days-of-month month days-of-week (like: 0 */5 * * * )
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo         ^</args^>
echo     ^</endpoint^>
echo ^</scheme^>

goto exit_script

:continue
:: no support for any cmdline arg other than --scheme
echo Usage: %0 --scheme
set exit_code=1

:exit_script
exit /b %exit_code%
