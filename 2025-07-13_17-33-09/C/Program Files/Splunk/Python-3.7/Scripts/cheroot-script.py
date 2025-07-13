#!C:\builds\splcore\main\build_home\splunk\bin\python3.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'cheroot==6.5.5','console_scripts','cheroot'
__requires__ = 'cheroot==6.5.5'
import re
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw?|\.exe)?$', '', sys.argv[0])
    sys.exit(
        load_entry_point('cheroot==6.5.5', 'console_scripts', 'cheroot')()
    )
