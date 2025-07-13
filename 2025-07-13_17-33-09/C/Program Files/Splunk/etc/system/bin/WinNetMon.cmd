@echo off

set exit_code=0

:loop_args
if "%1" == "" goto continue
if "%1" == "--scheme" goto do_scheme
shift
goto loop_args

:do_scheme
echo ^<scheme^>
echo     ^<title^>Local Windows network monitoring^</title^>
echo     ^<description^>This is an input for Splunk Network Monitor.^</description^>
echo     ^<use_single_instance^>true^</use_single_instance^>
echo     ^<script^>splunk-netmon.path^</script^>
echo     ^<streaming_mode^>xml^</streaming_mode^>
echo     ^<endpoint^>
echo         ^<id^>WinNetMon^</id^>
echo         ^<args^>
echo             ^<arg name="name"^>
echo                 ^<title^>name^</title^>
echo             ^</arg^>
echo             ^<arg name="addressFamily"^>
echo                 ^<title^>addressFamily^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<description^>Specifies address famility to monitor: ipv4 or ipv6. Can be a list of values separated by a semicolon.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="packetType"^>
echo                 ^<title^>packetType^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<description^>Specifies packet type to monitor: connect; accept; transport. Can be a list of values separated by a semicolon.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="direction"^>
echo                 ^<title^>direction^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<description^>Specifies packet direction to monitor: inbound; outgoing. Can be a list of values separated by a semicolon.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="protocol"^>
echo                 ^<title^>protocol^</title^>
echo                 ^<list_delimiter^>;^</list_delimiter^>
echo                 ^<description^>Specifies protocol to monitor: tcp or udp. Can be a list of values separated by a semicolon.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="remoteAddress"^>
echo                 ^<title^>remoteAddress^</title^>
echo                 ^<description^>Specifies remote address to monitor. Can be a regular expression.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="process"^>
echo                 ^<title^>process^</title^>
echo                 ^<description^>Specifies process/application name to monitor. Can be a regular expression.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="user"^>
echo                 ^<title^>user^</title^>
echo                 ^<description^>Specifies user name to monitor. Can be a regular expression. 
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="readInterval"^>
echo                 ^<title^>readInterval^</title^>
echo                 ^<description^>Advanced option. Read event buffer every interval milliseconds. It is recommended that default value is used unless there is a problem with network performance.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="driverBufferSize"^>
echo                 ^<title^>driverBufferSize^</title^>
echo                 ^<description^>Advanced option. Buffer at most driverBufferSize network packets in network driver. It is recommended that default value is used unless there is a problem with network performance. 
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="userBufferSize"^>
echo                 ^<title^>userBufferSize^</title^>
echo                 ^<description^>Advanced option. Buffer at most userBufferSize MB to events in user mode. It is recommended that default value is used unless there is a problem with network performance. 
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="mode"^>
echo                 ^<title^>mode^</title^>
echo                 ^<description^>Specifies output mode. Allowed values: single, multikv. Output each event individually or in multikv format.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="multikvMaxEventCount"^>
echo                 ^<title^>multikvMaxEventCount^</title^>
echo                 ^<description^>Advanced option. When multikv mode is used output at most  multikvMaxEventCount events.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="multikvMaxTimeMs"^>
echo                 ^<title^>multikvMaxTimeMs^</title^>
echo                 ^<description^>Advanced option. When multikv mode is used output no later than multikvMaxTimeMs milliseconds.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="sid_cache_disabled"^>
echo                 ^<title^>sid_cache_disabled^</title^>
echo                 ^<description^>Advanced option. Enables or disables account sid cache.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="sid_cache_exp"^>
echo                 ^<title^>sid_cache_exp^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for account sid cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="sid_cache_exp_neg"^>
echo                 ^<title^>sid_cache_exp_neg^</title^>
echo                 ^<description^>Advanced option. Indicates expiraiton time for negative account sid cache entries.
echo                 ^</description^>
echo                 ^<required_on_create^>false^</required_on_create^>
echo             ^</arg^>
echo             ^<arg name="sid_cache_max_entries"^>
echo                 ^<title^>sid_cache_max_entries^</title^>
echo                 ^<description^>Advanced option. Indicates maximum number of account sid cache entries.
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
