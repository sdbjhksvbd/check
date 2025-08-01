# Copyright 2017 MongoDB Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set (PACKAGE_VERSION 1.21.2)

if ("${PACKAGE_FIND_VERSION_MAJOR}" EQUAL "1")
   if ("${PACKAGE_FIND_VERSION_MINOR}" EQUAL "21")
      set (PACKAGE_VERSION_EXACT TRUE)
   elseif ("${PACKAGE_FIND_VERSION_MINOR}" LESS "21")
      set (PACKAGE_VERSION_COMPATIBLE TRUE)
   else ()
      set (PACKAGE_VERSION_UNSUITABLE TRUE)
   endif ()
elseif (PACKAGE_FIND_VERSION)
   set (PACKAGE_VERSION_UNSUITABLE TRUE)
endif ()
