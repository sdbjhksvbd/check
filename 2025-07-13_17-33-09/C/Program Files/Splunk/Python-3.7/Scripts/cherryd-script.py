#!C:\builds\splcore\main\build_home\splunk\bin\python3.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'CherryPy==18.1.2','console_scripts','cherryd'
__requires__ = 'CherryPy==18.1.2'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('CherryPy==18.1.2', 'console_scripts', 'cherryd')()
    )
