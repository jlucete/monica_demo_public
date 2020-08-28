# Monica demo
Demo page for MONICA

# Notice
- 어플리케이션 파일은 아래 코드에 경로를 지정하시면 됩니다.
```javascript
// index.js
/**
 * Download App
 */
let downloadBtn = document.getElementById('downloadBtn');
downloadBtn.onclick = function () {
    window.location.assign('download/DemoApplication.apk');
}
```
- 모델은 `models/monica` 또는 `models/transformer`에 `model.json`과 binary파일, `token_list.json`을 넣어주시면 됩니다.
- `token_list.json`에는 `token_list`라는 key가 반드시 존재해야합니다.
- 만약 모델 inference 중 input dimension이 맞지 않다는 오류가 발생하면 아래 코드에 해당 모델의 MINLEN를 설정해주시면 됩니다.

```javascript
// Recognizer.js
let MINLEN = {
  "sample": 187,
  "monica": 187,
  "transformer": 187,
}
```


# TODO List
- Upload fine-tuned models
- Update "contact us" e-mail & TEL
- (Optional) Mobile page