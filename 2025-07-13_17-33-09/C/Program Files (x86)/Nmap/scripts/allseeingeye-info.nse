local comm = require "comm"
local nmap = require "nmap"
local shortport = require "shortport"
local string = require "string"
local stdnse = require "stdnse"

description = [[
Detects the All-Seeing Eye service. Provided by some game servers for
querying the server's status.

The All-Seeing Eye service can listen on a UDP port separate from the
main game server port (usually game port + 123). On receiving a packet
with the payload "s", it replies with various game server status info.

When run as a version detection script (<code>-sV</code>), the script
will report on the game name, version, actual port, and whether it has a
password. When run explicitly (<code>--script allseeingeye-info</code>), the
script will additionally report on the server name, game type, map name,
current number of players, maximum number of players, player
information, and various other information.

For more info on the protocol see:
http://int64.org/docs/gamestat-protocols/ase.html
http://aluigi.altervista.org/papers.htm#ase
http://sourceforge.net/projects/gameq/
(relevant files: games.ini, packets.ini, ase.php)
]]

---
-- @usage
-- nmap -sV <target>
-- @usage
-- nmap -Pn -sU -sV --script allseeingeye-info -p <port> <target>
--
-- @output
-- PORT      STATE SERVICE      REASON       VERSION
-- 27138/udp open  allseeingeye udp-response All-Seeing Eye (game: chrome 1.2.0.0ww; port: 27015; no password)
-- | allseeingeye-info:
-- |   game: chrome
-- |   port: 27015
-- |   server name: ChromeNet Server
-- |   game type: Team Death Match
-- |   map: Data/LevelsNet/Narrow/Narrow.map
-- |   version: 1.2.0.0ww
-- |   passworded: 0
-- |   num players: 2
-- |   max players: 16
-- |   settings:
-- |     Dedicated: No
-- |     Password Required: No
-- |     Time Limit: 30
-- |     Points Limit: 200 min.
-- |     Respawns Limit: unlimited
-- |     Respawn Delay: 10 sec.
-- |     Enemies Visible On Map: No
-- |     Available Inventory Room: Yes
-- |     Identify Enemy Players: No
-- |     Available Vehicles: Yes
-- |     Vehicle Respaws Limit: unlimited
-- |     Vehicle Respawn Delay: 30 sec.
-- |     Vehicle Auto Return Time: 90 sec.
-- |     Vehicles Visible On Map: Yes
-- |     Team Balance: Off
-- |     Friendly Fire: On
-- |     Friends Visible On Map: Yes
-- |   players:
-- |     player 0:
-- |       name: NoVoDondo
-- |       team: BLUE
-- |       skin:
-- |       score: 71
-- |       ping: 0
-- |       time:
-- |     player 1:
-- |       name: HeroX
-- |       team: RED
-- |       skin:
-- |       score: 0
-- |       ping: 11
-- |_      time:
--
-- @xmloutput
-- <elem key="game">chrome</elem>
-- <elem key="port">27015</elem>
-- <elem key="server name">ChromeNet Server</elem>
-- <elem key="game type">Team Death Match</elem>
-- <elem key="map">Data/LevelsNet/Narrow/Narrow.map</elem>
-- <elem key="version">1.2.0.0ww</elem>
-- <elem key="passworded">0</elem>
-- <elem key="num players">2</elem>
-- <elem key="max players">16</elem>
-- <table key="settings">
--   <elem key="Dedicated">No</elem>
--   <elem key="Password Required">No</elem>
--   <elem key="Time Limit">30</elem>
--   <elem key="Points Limit">200 min.</elem>
--   <elem key="Respawns Limit">unlimited</elem>
--   <elem key="Respawn Delay">10 sec.</elem>
--   <elem key="Enemies Visible On Map">No</elem>
--   <elem key="Available Inventory Room">Yes</elem>
--   <elem key="Identify Enemy Players">No</elem>
--   <elem key="Available Vehicles">Yes</elem>
--   <elem key="Vehicle Respaws Limit">unlimited</elem>
--   <elem key="Vehicle Respawn Delay">30 sec.</elem>
--   <elem key="Vehicle Auto Return Time">90 sec.</elem>
--   <elem key="Vehicles Visible On Map">Yes</elem>
--   <elem key="Team Balance">Off</elem>
--   <elem key="Friendly Fire">On</elem>
--   <elem key="Friends Visible On Map">Yes</elem>
-- </table>
-- <table key="players">
--   <table key="player 0">
--     <elem key="name">NoVoDondo</elem>
--     <elem key="team">BLUE</elem>
--     <elem key="skin"></elem>
--     <elem key="score">71</elem>
--     <elem key="ping">0</elem>
--     <elem key="time"></elem>
--   </table>
--   <table key="player 1">
--     <elem key="name">HeroX</elem>
--     <elem key="team">RED</elem>
--     <elem key="skin"></elem>
--     <elem key="score">0</elem>
--     <elem key="ping">11</elem>
--     <elem key="time"></elem>
--   </table>
-- </table>

author = "Marin MarÅ¾iÄ‡"
license = "Same as Nmap--See https://nmap.org/book/man-legal.html"
categories = { "discovery", "safe", "version" }

portrule = shortport.version_port_or_service({1258,2126,3123,12444,13200,23196,26000,27138,27244,27777,28138}, "allseeingeye", "udp")

action = function(host, port)
  local status, data = comm.exchange(host, port, "s", { timeout = 3000 })
  if not status then
    return
  end

  -- UDP port is open
  nmap.set_port_state(host, port, "open")

  if not string.match(data, "^EYE1") then
    return
  end

  -- Detected; extract fields
  local o = stdnse.output_table()
  local pos = 5

  o["game"],
  o["port"],
  o["server name"],
  o["game type"],
  o["map"],
  o["version"],
  o["passworded"],
  o["num players"],
  o["max players"], pos = string.unpack(("s1"):rep(9), data, pos)

  -- extract the key-value pairs
  local kv = stdnse.output_table()
  o["settings"] = kv
  while data:byte(pos) ~= 1 do
    local key, value
    key, value, pos = string.unpack("s1s1", data, pos)
    kv[key] = value
  end
  pos = pos + 1

  -- extract player info
  local players = stdnse.output_table()
  o["players"] = players
  local playernum = 0
  while pos <= #data do
    local flags = data:byte(pos)
    pos = pos + 1

    local player = stdnse.output_table()
    if (flags & 1) ~= 0 then
      player.name, pos = string.unpack("s1", data, pos)
    end
    if (flags & 2) ~= 0 then
      player.team, pos = string.unpack("s1", data, pos)
    end
    if (flags & 4) ~= 0 then
      player.skin, pos = string.unpack("s1", data, pos)
    end
    if (flags & 8) ~= 0 then
      player.score, pos = string.unpack("s1", data, pos)
    end
    if (flags & 16) ~= 0 then
      player.ping, pos = string.unpack("s1", data, pos)
    end
    if (flags & 32) ~= 0 then
      player.time, pos = string.unpack("s1", data, pos)
    end

    players["player " .. playernum] = player
    playernum = playernum + 1
  end

  port.version.name = "ase"
  port.version.name_confidence = 10
  port.version.product = "All-Seeing Eye"
  local passworded_string
  if o["passworded"] == "0" then
    passworded_string = "; no password"
  else
    passworded_string = "; has password"
  end
  port.version.extrainfo = "game: " .. o["game"] .. " " .. o["version"] .. "; port: " .. o["port"] .. passworded_string

  nmap.set_port_version(host, port, "hardmatched")

  return o
end
