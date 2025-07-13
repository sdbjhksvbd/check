@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Local Windows registry monitoring^</title^>
echo     ^<description^>This is the Windows registry monitoring input.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-regmon.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>WinRegMon^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo             ^</arg^>
echo             ^<arg name="hive"^>
echo                 ^<title^>hive^</title^>
echo                 ^<required_on_create^>true^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="proc"^>
echo                 ^<title^>proc^</title^>
echo                 ^<required_on_create^>true^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="type"^>
echo                 ^<title^>type^</title^>
echo                 ^<required_on_create^>true^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="baseline"^>
echo                 ^<title^>baseline^</title^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo                 ^<validation^>is_bool('baseline')^</validation^>
echo             ^</arg^>
echo             ^<arg name="baseline_interval"^>
echo                 ^<title^>baseline_interval^</title^>
echo                 ^<validation^>is_pos_int('baseline_interval')^</validation^>
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
