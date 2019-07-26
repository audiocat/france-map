(function() {
  // object assign polyfill
  polyfill();

  var colorMap = [
    "#fff",
    "#27BBEE",
    "#88B14B",
    "#F5A623",
    "#FF7A7A"
  ];

  var cities=[{id:"大东部",lv:0,},{id:"中央-卢瓦尔河谷",lv:0,},{id:"科西嘉",lv:0,},{id:"新阿基坦",lv:0,},{id:"勃艮第-弗朗什-孔泰",lv:0,},{id:"布列塔尼",lv:0,},{id:"上法兰西",lv:0,},{id:"法兰西岛",lv:0,},{id:"诺曼底",lv:0,},{id:"奥克西塔尼",lv:0,},{id:"卢瓦尔河地区",lv:0,},{id:"普罗旺斯-阿尔卑斯-蓝色海岸",lv:0,},{id:"瓜德罗普",lv:0,},{id:"马提尼克",lv:0,},{id:"奥弗涅-罗讷-阿尔卑斯",lv:0}];

  var contextMenu = document.querySelector("#contextMenu");
  var menuTitle = document.querySelector('#menuTitle');
  var currentId = '';
  var total = 0;

  // city name text
  var cityTexts = [].map.call(document.querySelectorAll('text.city'), function (ele) { return ele; });
  cityTexts.map(function (cityText) {
    cityText.style.cursor = 'pointer';
    cityText.style.fontSize = 8;
    cityText.addEventListener('click', bindContextMenu);
  });

  // city area
  cities.map(function (city) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + city.id + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = '#fff';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', bindContextMenu);
    });
  });

  // hide context menu
  document.addEventListener('mouseup', closeWhenClickOutside);
  document.addEventListener('touchend', closeWhenClickOutside);

  function closeWhenClickOutside (e) {
    if (!contextMenu === e.target || !contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
    }
  }

  // set level
  var levels = [].map.call(document.querySelectorAll("div[id^='lv']"), function (ele) { return ele; });
  levels.map(function (level) {
    level.addEventListener('click', function (e) {
      var lv = parseInt(e.currentTarget.id.replace('lv', ''), 10);
      cities = cities.map(function (city) {
        if (city.id === currentId) {
          return Object.assign({}, city, { lv: lv });
        }
        return city;
      });
      contextMenu.style.display = 'none';
      changeCityColor(lv);
      calcTotal();
    });
  });

  // save as png
  document.querySelector('#saveAs').addEventListener('click', function () {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 1124;
    canvg(canvas, svgString, {ignoreClear: true});
    canvas.toBlob(function (blob) { saveAs(blob, 'france.png'); });
  });

  function bindContextMenu (e) {
    // 180: context menu width, 20: buffer
    // 165: context menu height, 30: buffer
    const widthOffset = window.innerWidth - e.pageX - 180 - 20;
    const heightOffset = window.innerHeight - e.pageY - 165 - 30;
    const x = widthOffset > 0 ? e.pageX : e.pageX + widthOffset;
    const y = heightOffset > 0 ? e.pageY : e.pageY + heightOffset;
    contextMenu.style.top = y + 'px';
    contextMenu.style.left= x + 'px';
    contextMenu.style.display = 'block';
    currentId = (e.target.id || e.target.textContent).replace(/\d*/g, '');
    menuTitle.textContent = currentId;
  }

  function calcTotal () {
    total = 0;
    cities.map(function (city) {
      total += city.lv;
    });
    document.querySelector('#total').textContent= total;
  }

  function changeCityColor (lv) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + currentId + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = colorMap[lv];
    });
  }

  /**
   ** Object assign polyfill
   ** https://github.com/rubennorte/es6-object-assign
   **/

  function assign(target, firstSource) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  function polyfill() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: assign
      });
    }
  }
})();
