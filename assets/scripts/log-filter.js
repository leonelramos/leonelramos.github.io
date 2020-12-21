const main = () => 
{
    let toggleState = {}
    let logs = document.getElementsByClassName("log");
    let filter_buttons = document.getElementsByClassName("filter-button");
    for(let filter_button of filter_buttons)
    {
        toggleState[filter_button.value] = true;
        filter_button.addEventListener('click', () => {
            tag = filter_button.value;
            toggleState[tag] = !toggleState[tag]
            toggleLogs(tag, logs, toggleState);
            filter_button.classList.toggle("active-filter");
        });
    }
}

const toggleLogs = (tag, logs, toggleState) =>
{
    for(log of logs)
    {
        if(log.classList.contains(tag))
        {
            let skip = false;
            for(let class_name of log.classList)
            {
                if(className != tag && toggleState[class_name] == false) skip = true;;
            }
            if(!skip) log.classList.toggle("hidden");
        }
    }
}

document.addEventListener('DOMContentLoaded', main)