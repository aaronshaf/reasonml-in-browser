```html
<script src="https://unpkg.com/reasonml-in-browser/reasonml-in-browser.js"></script>

<script type="text/reason">
type dataLoadingStatusVariant =
  | Loading
  | Successful
  | Error;

let dataLoadingStatus = Successful;

let message =
  switch dataLoadingStatus {
  | Loading => "Loading"
  | Successful => "Successful"
  | Error => "Error"
  };

Js.log(message);
</script>
```
