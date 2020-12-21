const main = () => 
{
    let logs = document.getElementsByClassName("log");
    let filter_buttons = document.getElementsByClassName("filter-button");
    for(let filter_button of filter_buttons)
    {
        filter_button.addEventListener('click', () => {
            tag = filter_button.value;
            
            toggleLogs(tag, logs);
            filter_button.classList.toggle("active-filter");
        });
    }
}

const toggleLogs = (tag, logs) =>
{
    for(log of logs)
    {
        if(log.classList.contains(tag))
        {
            log.classList.toggle("hidden");
        }
    }
}

document.addEventListener('DOMContentLoaded', main)