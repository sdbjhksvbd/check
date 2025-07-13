@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Local Windows print monitoring^</title^>
echo     ^<description^>Collect information about printers, printer jobs, print drivers, and print ports on this machine.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-winprintmon.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>WinPrintMon^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="type"^>
echo                 ^<title^>type^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="baseline"^>
echo                 ^<title^>baseline^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<validation^>is_bool('baseline')^</validation^>
echo             ^</arg^>
echo             ^<arg name="interval"^>
echo                 ^<validation^>is_pos_int('interval')^</validation^>
echo                 ^<title^>interval^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<data_type^>number^</data_type^>
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
