export const styles = {
    main_container: `
        width: max-content; 
        position: relative; 
        margin: auto;
    `,
    toggle_switch: `
        color: darkgrey; 
        margin-right: 1em;
    `,
    open_interactive_maker: `
        color: darkgrey;
    `,
    flex: `
        display: flex; 
        justify-content: center;
    `,
    close_icon: `
        position: absolute; 
        right: 1em; 
        top: 1em;
    `,
    interactive_container: `
        width: 300px; 
        position: relative; 
        z-index: 1; 
        margin: 2em auto auto;
    `,
    selected_border: `
        border-bottom: 2px solid #bfbfbf;
    `,
    tab_name: `
        padding: 0.5em; 
        font-size: 1.5em;
    `,
    button_wrapper: `
        margin-block: 1em; 
        cursor: pointer;
    `,
    error_message: `
        display: flex; 
        justify-content: center; 
        color: var(--error-color)
    `,
    ha_card: `
        height: 40vh;
        max-width: 300px;
        overflow-y: auto;
        padding: 0.5em;
        display: flex;
        flex-wrap: wrap;
        align-content: start;
    `,
    toggle_areas: `
        width: 100%;
        margin: 0.5em; 
        text-align: center;
    `,
    toggle_all_areas: `
        padding: 0.5em;
        cursor: pointer;
    `,
    toggle_one_area: `
        margin: 0.5em; 
        width: max-content; 
        display: flex; 
        cursor: pointer;
    `,
    edit_existing: `
        flex-basis: 100%;
        text-align: center;
        margin-top: 2em;
    `,
    flex_column: `
        display: flex;
        flex-direction: column;
        align-items: center;
    `,
    flex_child: `
        margin: 0.5em;
        flex-basis: 100%;
    `,
    delete_image_paragraph: `
        word-break: break-word;
        text-align: center;
    `,
    upload_container: `
        margin: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    image_contianer: `
        display: flex;
        width: 300px;
        position: relative;
        flex-wrap:no-wrap;
    `,
    select_previous: `
        transform: translateY(5em) rotate(90deg);
        position: absolute;
        left: -1.5em;
        z-index: 1;
        background: rgba(51, 51, 51, 0.37);;
    `,
    select_next: `
        transform: translateY(5em) rotate(-90deg);
        position: absolute;
        right: -1.5em;
        z-index: 1;
        background: rgba(51, 51, 51, 0.37);;
    `,
    alert_style: `
        position: fixed; 
        bottom: 0; 
        left: 0; 
        background:  rgba(51, 51, 51, 0.37);
    `,
    delete_image: `
        position: absolute; 
        right: 0; 
        top: 0; 
        background: rgba(51, 51, 51, 0.37);
    `,
    selected_tab: `
        border-bottom: 2px solid #bfbfbf;
    `,
    header: `
        width: 100%; 
        margin-top: 2em; 
        text-align: center;
    `,
    pre_style: `
        user-select: text; 
        max-height: 70vh; 
        overflow: auto; 
        padding: 1em;
        background: rgba(51, 51, 51, 0.37);
    `,
    close: `
        position: absolute; 
        right: 1em; 
        top: 1em
    `,
    copy: `
        position: absolute; 
        right: 4em; 
        top: 1em
    `,
    copy_and_open_config: `
        position: absolute; 
        right: 7em; 
        top: 1em
    `,
    svg_style: `
        position: absolute; 
        left: 0; 
        pointer-events: all;
        top: 0;
    `,
    ha_card_new_area: `
        height: 368px; 
        max-width: 300px; 
        overflow-y: auto; 
        padding: 0.5em
    `,
    cursor: `
        cursor: pointer;
    `,
    inputs_container: `
        height: calc(40vh - 6.25em); 
        max-height: 400px;
    `,
    tryout_mode: `
        margin-block: 1em;
        align-items: center;
    `,
    flex_wrap: `
        display: flex; 
        flex-wrap: wrap;
    `,
    flex_space_evenly: `
        display: flex; 
        justify-content: space-evenly;
        width: 100%;
    `,
    flex_inputs: `
        display: flex;
        justify-content: space-between;
        align-items: center;
        position:relative;
    `,
    input: `
        padding: 0.5em;
        border-radius: 10px;
        flex-basis: 70%;
    `,
    list_container: `
        width: 270px;
        max-height: 150px;
        height: max-content;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
        left: 0;
        top: 90%;
        z-index: 2;
        background-color: var(--card-background-color);
        margin-top: 0.5em;
    `
}