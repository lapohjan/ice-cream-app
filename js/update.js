'use strict';
(function(){
    let iceCreamList;
    let resultArea;
    document.addEventListener('DOMContentLoaded', init);
    async function init () {
        iceCreamList = document.getElementById('iceCreamList');
        resultArea = document.getElementById('resultarea');
        try{
            //const flavors = await fetch('/all').then(result=>result.json());
            const data =await fetch('/all');
            const flavors = await data.json();
            populateIceCreamList(flavors);
            }
            catch(err){
                showErrorMessage(err.message);
            }
    }
    function populateIceCreamList(queryResult){
        if(!queryResult || queryResult.message){
            showErrorMessage('Sorry, something went wrong.');
        }
        else {
            for(let flavor of queryResult){
                const option=document.createElement('option');
                option.value=flavor;
                option.textContent=flavor;
                iceCreamList.appendChild(option);
            }
            iceCreamList.addEventListener('change', choose);
            iceCreamList.value='';
        }
    }
    async function choose(){
        const iceCream=iceCreamList.value;
        if(iceCream.length>0) {
            try{
                const data = await fetch(`/icecreams/${iceCream}`).then(result => result.json());
                updateResult(data);
            }
            catch(err) {
                showErrorMessage(err.message);
            }
        }
        else {
            clearResultarea();
        }
    }

    function clearResultarea() {
        resultarea.innerHTML='';
    }

    function updateResult(data) {
        if(!data) {
            showErrorMessage('Programming error. Sorry!')
        }
        else if(data.message) {
            showErrorMessage(data.message);
        }
        else if(data.name && data.name.length===0) {
            clearResultarea();
        }
        else {
            let htmlString=`
            <div>
                <p id="name>${data.name}</p>
                <p id="price>${data.price} €</p>
            </div>`;
            if(data.image && data.image.length>0) {
                htmlString+=`<img id="image" src="/images/${data.image}" />`;
            }
            resultarea.innerHTML=htmlString;
        }
    }

    function showErrorMessage(message){
        resultarea.innerHTML=`
        <div class="error">
        <h2>Error</h2>
        <p>${message}</p>
        </div>
        `;
    }
})();