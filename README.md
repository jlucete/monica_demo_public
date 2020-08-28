# Monica demo
Demo page for MONICA

# Notice
- 어플리케이션 파일은 아래 코드에 경로를 지정하시면 됩니다.
`index.js`
```javascript
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


# TODO List
- Upload fine-tuned models
- Update `contact us` e-mail & TEL
- (Optional) Mobile page