@echo off

rem = """
"%~dp0\splunk" cmd python3 -s -x "%~f0" %*
goto endofPython """
# Copyright (c) Splunk, Inc. All Rights Reserved.

from os import path
import re
import sys


def _update_system_path():
    splunk_packaging_toolkit = path.join(path.dirname(path.dirname(path.abspath(__file__))), 'Python-3.7/Lib/site-packages')
    if splunk_packaging_toolkit not in sys.path:
        sys.path.insert(0, splunk_packaging_toolkit)

_update_system_path()
del _update_system_path
from slim.__main__ import main

if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    main()
    
rem = """
:endofPython """
