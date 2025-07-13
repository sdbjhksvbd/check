/*!
 * Copyright (c) 2007-2016 Jason Gatt
 * 
 * Released under the MIT license:
 * http://opensource.org/licenses/MIT
 */
define(function(require, exports, module)
{

	var UID = require("./UID");
	var Class = require("../Class");

	return Class(module.id, Object, function(TrieMap, base)
	{

		// Private Static Methods

		var _get = function(node, keyIndex, keyCount, keys)
		{
			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(keys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return void(0);

				return _get(entries[uid], keyIndex + 1, keyCount, keys);
			}

			if (!node.hasOwnProperty("value"))
				return void(0);

			return node.value;
		};

		var _set = function(node, keyIndex, keyCount, keys, value)
		{
			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(keys[keyIndex]);
				if (!entries.hasOwnProperty(uid))
					entries[uid] = { _entries: {}, _size: 0, key: keys[keyIndex] };

				if (!_set(entries[uid], keyIndex + 1, keyCount, keys, value))
					return false;

				node._size++;
				return true;
			}

			if (node.hasOwnProperty("value"))
			{
				node.value = value;
				return false;
			}

			node.value = value;
			node._size++;
			return true;
		};

		var _del = function(node, keyIndex, keyCount, keys)
		{
			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(keys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return false;

				if (!_del(entries[uid], keyIndex + 1, keyCount, keys))
					return false;

				if (entries[uid]._size === 0)
					delete entries[uid];

				node._size--;
				return true;
			}

			if (!node.hasOwnProperty("value"))
				return false;

			delete node.value;
			node._size--;
			return true;
		};

		var _has = function(node, keyIndex, keyCount, keys)
		{
			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(keys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return false;

				return _has(entries[uid], keyIndex + 1, keyCount, keys);
			}

			return node.hasOwnProperty("value");
		};

		var _size = function(node, keyIndex, keyCount, prefixKeys)
		{
			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(prefixKeys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return 0;

				return _size(entries[uid], keyIndex + 1, keyCount, prefixKeys);
			}

			return node._size;
		};

		var _clear = function(node, keyIndex, keyCount, prefixKeys)
		{
			var clearCount;

			if (keyIndex < keyCount)
			{
				var entries = node._entries;
				var uid = UID.get(prefixKeys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return 0;

				clearCount = _clear(entries[uid], keyIndex + 1, keyCount, prefixKeys);
				if (clearCount === 0)
					return 0;

				if (entries[uid]._size === 0)
					delete entries[uid];

				node._size -= clearCount;
				return clearCount;
			}

			clearCount = node._size;
			if (clearCount === 0)
				return 0;

			delete node.value;
			node._entries = {};
			node._size = 0;
			return clearCount;
		};

		var _keys = function(node, keyIndex, keyCount, prefixKeys, outKeys, pathKeys)
		{
			if (!pathKeys)
				pathKeys = [];

			var entries = node._entries;
			var uid;

			if (keyIndex < keyCount)
			{
				uid = UID.get(prefixKeys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return;

				pathKeys.push(entries[uid].key);
				_keys(entries[uid], keyIndex + 1, keyCount, prefixKeys, outKeys, pathKeys);
				pathKeys.pop();
				return;
			}

			if (node.hasOwnProperty("value"))
				outKeys.push(pathKeys.concat());

			for (uid in entries)
			{
				if (entries.hasOwnProperty(uid))
				{
					pathKeys.push(entries[uid].key);
					_keys(entries[uid], keyIndex, keyCount, prefixKeys, outKeys, pathKeys);
					pathKeys.pop();
				}
			}
		};

		var _values = function(node, keyIndex, keyCount, prefixKeys, outValues)
		{
			var entries = node._entries;
			var uid;

			if (keyIndex < keyCount)
			{
				uid = UID.get(prefixKeys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return;

				_values(entries[uid], keyIndex + 1, keyCount, prefixKeys, outValues);
				return;
			}

			if (node.hasOwnProperty("value"))
				outValues.push(node.value);

			for (uid in entries)
			{
				if (entries.hasOwnProperty(uid))
					_values(entries[uid], keyIndex, keyCount, prefixKeys, outValues);
			}
		};

		var _pairs = function(node, keyIndex, keyCount, prefixKeys, outPairs, pathKeys)
		{
			if (!pathKeys)
				pathKeys = [];

			var entries = node._entries;
			var uid;

			if (keyIndex < keyCount)
			{
				uid = UID.get(prefixKeys[keyIndex], false);
				if (!uid || !entries.hasOwnProperty(uid))
					return;

				pathKeys.push(entries[uid].key);
				_pairs(entries[uid], keyIndex + 1, keyCount, prefixKeys, outPairs, pathKeys);
				pathKeys.pop();
				return;
			}

			if (node.hasOwnProperty("value"))
				outPairs.push([ pathKeys.concat(), node.value ]);

			for (uid in entries)
			{
				if (entries.hasOwnProperty(uid))
				{
					pathKeys.push(entries[uid].key);
					_pairs(entries[uid], keyIndex, keyCount, prefixKeys, outPairs, pathKeys);
					pathKeys.pop();
				}
			}
		};

		// Private Properties

		this._entries = null;
		this._size = 0;

		// Constructor

		this.constructor = function(entries)
		{
			this._entries = {};

			if (entries != null)
			{
				for (var i = 0, l = entries.length; i < l; i++)
					this.set(entries[i][0], entries[i][1]);
			}
		};

		// Public Methods

		this.get = function(keys)
		{
			if (keys == null)
				throw new Error("Parameter keys must be non-null.");
			if (!Class.isArray(keys))
				throw new Error("Parameter keys must be of type Array.");

			var keyCount = keys.length;
			if (keyCount === 0)
				throw new Error("Parameter keys must be non-empty.");

			return _get(this, 0, keyCount, keys);
		};

		this.set = function(keys, value)
		{
			if (keys == null)
				throw new Error("Parameter keys must be non-null.");
			if (!Class.isArray(keys))
				throw new Error("Parameter keys must be of type Array.");

			var keyCount = keys.length;
			if (keyCount === 0)
				throw new Error("Parameter keys must be non-empty.");

			_set(this, 0, keyCount, keys, value);
			return this;
		};

		this.del = function(keys)
		{
			if (keys == null)
				throw new Error("Parameter keys must be non-null.");
			if (!Class.isArray(keys))
				throw new Error("Parameter keys must be of type Array.");

			var keyCount = keys.length;
			if (keyCount === 0)
				throw new Error("Parameter keys must be non-empty.");

			_del(this, 0, keyCount, keys);
			return this;
		};

		this.has = function(keys)
		{
			if (keys == null)
				throw new Error("Parameter keys must be non-null.");
			if (!Class.isArray(keys))
				throw new Error("Parameter keys must be of type Array.");

			var keyCount = keys.length;
			if (keyCount === 0)
				throw new Error("Parameter keys must be non-empty.");

			return _has(this, 0, keyCount, keys);
		};

		this.size = function(prefixKeys)
		{
			if (prefixKeys == null)
				return _size(this, 0, 0, null);
			else if (Class.isArray(prefixKeys))
				return _size(this, 0, prefixKeys.length, prefixKeys);
			else
				throw new Error("Parameter prefixKeys must be of type Array.");
		};

		this.clear = function(prefixKeys)
		{
			if (prefixKeys == null)
				_clear(this, 0, 0, null);
			else if (Class.isArray(prefixKeys))
				_clear(this, 0, prefixKeys.length, prefixKeys);
			else
				throw new Error("Parameter prefixKeys must be of type Array.");

			return this;
		};

		this.keys = function(prefixKeys)
		{
			var keys = [];

			if (prefixKeys == null)
				_keys(this, 0, 0, null, keys);
			else if (Class.isArray(prefixKeys))
				_keys(this, 0, prefixKeys.length, prefixKeys, keys);
			else
				throw new Error("Parameter prefixKeys must be of type Array.");

			return keys;
		};

		this.values = function(prefixKeys)
		{
			var values = [];

			if (prefixKeys == null)
				_values(this, 0, 0, null, values);
			else if (Class.isArray(prefixKeys))
				_values(this, 0, prefixKeys.length, prefixKeys, values);
			else
				throw new Error("Parameter prefixKeys must be of type Array.");

			return values;
		};

		this.pairs = function(prefixKeys)
		{
			var pairs = [];

			if (prefixKeys == null)
				_pairs(this, 0, 0, null, pairs);
			else if (Class.isArray(prefixKeys))
				_pairs(this, 0, prefixKeys.length, prefixKeys, pairs);
			else
				throw new Error("Parameter prefixKeys must be of type Array.");

			return pairs;
		};

		this.entries = function(prefixKeys)
		{
			return this.pairs(prefixKeys);
		};

	});

});
