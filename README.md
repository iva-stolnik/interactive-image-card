# Interactive Image Card

This is advanced custom card for the Home Assistant Lovelace dashboard. It **simplifies uploading, browsing, and image management** within Home Assistant, with a special feature allowing users to **create and (re)use interactive areas on images or videos**.  When these designated areas are clicked, they trigger predefined service calls linked to specific entities within the card's configuration.

## FEATURES
- **Image Management:** Upload, delete and browse existing HA images - completely new interface for basic images managing.
 
- **Dynamic Display Options:** Display image (uploaded or linked) or camera stream in HA lovelace dashboard.

- **Interactive Image Maker:** Completely new interface for creation of interactive areas, simple and intuitive. **No more manually written css positions!**:
  
  - **Drawing Interactive Areas:** Create interactive areas - draw them directly on image, add name, service and entity_id.
    
  - **Automated YAML Generation:** YAML for card is dynamically generated and ready to be copied to card as a new config. `Copy icon` only copies YAML, while `pencil icon` copies YAML and opens edit mode.
              
  - **Call service when area is clicked:** Use interactive areas to call assigned services in HA.

  
## IMPORTANT
To browse existing images from `/config/image/` it is **required** to add following to HA `configuration.yaml` and reload it. This will create `sensor.image` entity with list of all images which is used in this card.

To learn more about [folders](https://www.home-assistant.io/integrations/folder/) and [allow lists](https://www.home-assistant.io/integrations/homeassistant/#allowlist_external_dirs) follow links.
  ```
  homeassistant:
    allowlist_external_dirs:
      - "/config/image"
  
  sensor:
    - platform: folder
      folder: /config/image
      filter: "*"
  ```
  
## NOTES
- Url can be added to card YAML manually, but if no url or entity_picture is specified, upload view will be shown. Image is uploaded to `/config/image/` directory.
 
- Multiple cards can share the same configuration, with the exception of `size`. All interactive areas will be automatically scaled to fit given size, so manual adjustments to their positions are not necessary.

- Interactive areas can be removed for a specific card only in its own card YAML.


## ADD CARD TO HA

- Add through HACS as custom repo:
  
  - Open HACS, select frontend and click on 3 dots in upper right corner.

  - Open custom repositories and paste this link to repository input: `https://github.com/iva-stolnik/interactive-image-card`.

  - Select lovelace as category.

  - Reload HA.

- Copy code from `main.js` to Home Assistant `/config/www/your-directory/main.js`:

  - Add resource to dashboard.

  - Resource type: JavaScript module.

  - Url: `/local/your-directory/main.js`.
   


## OPTIONS
| Name              | Type    | Requirement  | Default  | Description                                                                                                                                                                                   |
| ----------------- | ------- | ------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type              | string  | Required     |          | custom:interactive-image-card                                                                                                                                                                 |
| editable          | boolean | Required     |          | when `true` interactive areas and edit button are visible on card and interactive image editor will be accessible to create new interactive areas                                             |
| url               | string  | Optional     |          | image url                                                                                                                                                                                     |
| entity_picture    | string  | Optional     |          | entity_id, used if entity has `entity_picture` attribute                                                                                                                                      |
| stream            | boolean | Optional     |false     | set to true when streaming camera with `entity_picture`                                                                                                                                       |
| size              | string  | Optional     |300       | image width in pixel                                                                                                                                                                          |
| use_vibration     | boolean | Optional     |false     | vibration feedback when interactive area is clicked                                                                                                                                           |
| interactive-areas | list    | Optional     |          | list of areas on the image that trigger specified actions. Each area includes properties like `name`, `entity_id`, `points`, `service`, `confirm_action`, `always_visible` and `service_data` |


## interactive-areas options
| Name              | Type            | Requirement  | Default  | Description                                                                                                              |
| ----------------- | --------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| name              | string          | Required     |          | interactive area name, will be shown in existing areas tab in interactive image maker                                    |
| entity_id         | string or array | Required     |          | entity to be called with given service (below), eg. `light.wl_office_1`                                                  |
| points            | string          | Required     |          | points for interactive area                                                                                              |
| service           | string          | Required     |          | HA service to be called upon given entity_id, eg. `toggle`                                                               |
| confirm_action    | boolean         | Optional     | false    | confirm modal for sensitive actions, eg. `return_to_base` service call for vacuum to ensure it's not clicked by accident |
| always_visible    | boolean         | Optional     | false    | when `true` interactive area is always visible                                                                           |
| service_data      | any             | Optional     |          | editable only within card YAML (see vacuum example)                                                                      |


## UPLOAD/BROWSE EXISTING IMAGES
<div align="center">
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/efccc116-1e41-4e01-aa87-520a910c4997" alt="Capture11"/>
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/e9cb792a-1d46-4373-a32e-410593341204" alt="Capture10"/>
</div>

## CARD EXAMPLE IN LOVELACE DASHBOARD
<div align="center">
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/e83a73a3-73a0-485a-bde7-21582c5e27a5" alt="Capture8"/>
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/25591daf-8fb4-4684-b642-e6a63cae515f" alt="Capture8"/>
</div>


### YAML configuration for card above
```
type: custom:interactive-image-card
size: 300
editable: true
url: /api/image/serve/xxxxxxxx/512x512
interactive_areas:
  - name: Fan toggle
    entity_id: fan.lounge
    service: toggle
    points: >-
      3,179,2,180,6,179,15,180,25,186,32,192,36,196,39,206,38,222,37,227,35,232,33,236,31,238,29,241,24,246,20,248,12,249,8,250,6,249,5,248
  - name: Toggle music
    entity_id: media_player.living_room
    service: media_play_pause
    points: 256,111,263,156,293,158,292,116
  - name: ceiling lights
    entity_id: light.living_room_lights_group
    service: toggle
    points: 2,34,126,62,298,29,299,1,2,0
```

### SIMPLE CARD WITH IMAGE ONLY
uploaded:
```
type: custom:interactive-image-card
editable: true
url: /api/image/serve/xxxxxxxx/512x512
```
linked:
```
type: custom:interactive-image-card
editable: true
url: https://design.home-assistant.io/images/brand/logo.png
```

### CARD WITH IMAGE AND INTERACTIVE AREAS AND MULTIPLE ENTITES
*Service data is manually added and has the same syntax as in automations. It can be created there and just c/p to card YAML
```
type: custom:interactive-image-card
url: /api/image/serve/xxxxxxxx/512x512
size: 400
editable: false
use_vibration: true
interactive_areas:
  - name: toggle table light
    entity_id:
      - light.wl_table_2
      - light.wl_table_1
    points: 0,0, 100,0, 100,100, 0,100, 0,0
    service: turn_on
    always_visible: true
    service_data:
      rgb_color:
        - 180
        - 0
        - 255
      brightness_pct: 35
```

Dynamic vacuum map with interactive areas and service data example. This uses both `state` and attribute `entity_picture` of given entity
```
type: custom:interactive-image-card
entity_picture: image.optimus_prime_map
size: 300
editable: true
use_vibration: true
interactive_areas:
  - name: send home
    entity_id: vacuum.optimus_prime
    service: return_to_base
    points: 213,153,217,178,238,175,242,156
    confirm_action: true
  - name: Vacuum kitchen
    entity_id: vacuum.optimus_prime
    service: send_command
    points: 202,198,201,197,199,308,274,304,267,194
    service_data:
      command: spot_area
      params:
        rooms: 1
        cleanings: 1
```

Camera stream with interactive areas. Ptz service and service data can be added only within card YAML. New interactive area can be made only with points (entity_id or service dont need to be defined), and later edited in card YAML
```
type: custom:interactive-image-card
editable: true
entity_picture: camera.lc_profile000
stream: true
size: 400
interactive_areas:
  - name: Move left
    entity_id: camera.lc_profile000
    service: ptz
    points: 65,5,64,4,68,7,67,6,56,159,55,158,13,157,1,154,9,8
    service_data:
      pan: LEFT
      move_mode: ContinuousMove
      distance: 0.5
  - name: move right
    entity_id: camera.lc_profile000
    service: ptz
    points: 258,3,248,166,297,164,299,4
    service_data:
      pan: RIGHT
      move_mode: ContinuousMove
      distance: 0.5
  - name: move down
    entity_id: camera.lc_profile000
    service: ptz
    points: 5,120,293,116,296,161,12,162
    service_data:
      tilt: DOWN
      move_mode: ContinuousMove
      distance: 0.5
  - name: move up
    entity_id: camera.lc_profile000
    service: ptz
    points: 4,3,6,36,296,33,295,3
    service_data:
      tilt: UP
      move_mode: ContinuousMove
      distance: 0.5

```


## Troubleshooting

Encountering issues? Here are some common problems and their solutions:

- **Images Not Uploading**: Ensure that the `/config/image/` directory has the correct permissions. Restart Home Assistant after making changes to directory permissions.

- **Interactive Areas Not Responding**: Check that the `entity_id`, `points` and `service` are correctly specified in your YAML configuration. Verify that the specified entities are available and responsive in Home Assistant.

Ensure you are using the latest version from the repository. Also, clear your browser/mobile app cache if problems persist after updates.

For more complex issues or if your problem is not listed here, please open an issue on the [GitHub issues](https://github.com/iva-stolnik/interactive-image-card/issues) or seek help in the [Home Assistant Community forum](https://community.home-assistant.io/t/custom-interactive-image-card/718100).


## Contribution and Support

Contributions to this project are welcome! Here’s how you can help:

- **Reporting Bugs**: If you find a bug, please report it by opening an issue on the GitHub repository.

- **Feature Requests**: Have ideas on how to improve the card? Open an issue with the tag `feature request`.


