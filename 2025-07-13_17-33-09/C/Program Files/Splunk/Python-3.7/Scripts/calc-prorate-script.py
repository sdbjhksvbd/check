#!C:\builds\splcore\main\build_home\splunk\bin\python3.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'tempora==1.14.1','console_scripts','calc-prorate'
__requires__ = 'tempora==1.14.1'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('tempora==1.14.1', 'console_scripts', 'calc-prorate')()
    )
