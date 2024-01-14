async function getAgents(){
    let response = await fetch('http://localhost:5500/api/agents')
    return await response.json()
}

async function agentsRender(div){
    let agents = await getAgents()
    agents.forEach((item)=>{
        let agentDiv = document.createElement('div')
        let label = document.createElement('label')
        let selectElem = document.createElement('select')
        label.textContent=`${item.location}`
        item.agents.forEach((item)=>{
            selectElem.innerHTML+=`<option value='${item}'>${item}</option>`
        })
        agentDiv.append(label,selectElem)
        div.append(agentDiv)
    })
}