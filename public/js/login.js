function login() {

    const uname = document.getElementById('uname').value;
    const pword = document.getElementById('pword').value;

    const send = { uname, pword };
    console.log(send);

    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(send)
    }).then(res => res.json()).then(content => console.log(content)).catch(err => console.log(err));
    console.log("fetch");

}