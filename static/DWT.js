var DWObject = null;

console.log("loading");

function CreateDWT(callback) {
  var success = function (obj) {
    DWObject = obj;
    //DWObject.Viewer.bind(document.getElementById('dwtcontrolContainer'));
    //DWObject.Viewer.show();
    callback(true);
  };

  var error = function (err) {
    callback(false);
  };

  Dynamsoft.DWT.CreateDWTObjectEx({
    WebTwainId: 'dwtcontrol'
  },
    success,
    error
  );
}

function Scan(options,callback) {
  if (DWObject) {
    DWObject.SelectSourceByIndex(options.selectedIndex);
    DWObject.CloseSource();
    DWObject.OpenSource();
    DWObject.IfShowUI = options.showUI;
    DWObject.PixelType = options.pixelType;
    DWObject.Resolution = options.resolution;
    
    var OnAcquireImageSuccess = function () {
      var success = function (result, indices, type) {
        callback(result.getData(0, result.getLength()));
      };

      var error = function (errorCode, errorString) {
        callback(false);
      };

      DWObject.ConvertToBase64(
        [DWObject.CurrentImageIndexInBuffer],
        Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG,
        success,
        error
      );
    }
    var OnAcquireImageError = function () {
      callback(false);
    }
    DWObject.AcquireImage(OnAcquireImageSuccess, OnAcquireImageError);
  } else {
    callback(false);
  }
}

function GetScannersList() {
  var scanners = [];
  var count = DWObject.SourceCount;
  for (var i = 0; i < count; i++) {
    scanners.push(DWObject.GetSourceNameItems(i));
  }
  return scanners;
}
