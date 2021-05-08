const dialog = new mdc.dialog.MDCDialog(document.querySelector('.mdc-dialog'));
const clear = () => {
    console.log('clear!')
}
document.getElementById('preferences').addEventListener('click', (e) => {
      dialog.open()      
})

