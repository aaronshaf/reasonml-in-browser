```html
<script src="https://unpkg.com/reasonml-in-browser"></script>
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/reasonml-in-browser/index.js"></script>
```

```html
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
