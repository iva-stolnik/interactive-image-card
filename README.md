
# Interactive Image Card

A custom card for Home Assistant Lovelace dashboard 

## FEATURES
  * upload images to HA,
  * browse existing HA images
  * delete image
  * display image (uploaded or linked) or camera stream in HA lovelace dashboard
  * interactive image maker
    * easily create interactive areas - draw them directly on image
    * add service and entity_id to drawn area
    * dynamicaly generated YAML when using uploaded image or a new interactive area is created
      * c/p it to card as a new config
      * pencil icon copies YAML and opens edit mode
      * copy icon only copies YAML
    * toggle interactive areas to call assigned services in HA

## NOTES
* Url can be added manually, but if no url or entity_picture is specified, upload view will be shown
* Image is uploaded to `/config/image/` directory (where are area and person images)
* Interactive areas can be removed for a specific card only in its own card YAML
* Multiple cards can share the same config except `size` and all interactive areas will be correctly scaled up


## OPTIONS

| Name              | Type    | Requirement  | Default             | Description                                 |
| ----------------- | ------- | ------------ | ------------------- | ------------------------------------------- |
| type              | string  | Required     |                     | custom:interactive-image-card
| editable          | boolean | Required     |                     | show interactive areas/edit button, when enabled interactive editor will be accessible, othervise it shows image with or without interactive areas
| url               | string  | Optional      |                     | image url 
| entity_picture    | string  | Optional    |                     | entity_id
| stream            | boolean | Optional     |false                | set to true when streaming camera with entity_picture 
| size              | string  | Optional     |300                  | image width in px
| use_vibration     | boolean | Optional     |false                | vibration feedback when interactive area is clicked
| interactive-areas | list    | Optional     |                     | list of areas on the image that trigger specified actions. Each area includes properties like `name`, `entity_id`, `points`, `service`, `confirm_action`, `always_visible` and `service_data` |

## interactive-areas options
| Name              | Type     | Requirement  | Default             | Description                                 |
| ----------------- | -------- | ------------ | ------------------- | ------------------------------------------- |
| name              | string   | Required     |                     | interactive area name
| entity_id         | string   | Required     |                     | string or array of strings
| points            | string   | Required     |                     | points for interactive area
| service           | string   | Required     |                     | HA service to be called upon given entity_id
| confirm_action    | boolean  | Optional     | false               | confirm modal for sensitive actions
| always_visible    | boolean  | Optional     | false               | when true interactive area is always visible
| service_data      | any      | Optional     |                     | editable only in card YAML (see vacuum example)

## ADD CARD TO HA
  * add through HACS as custom repo or, 
  * copy code from `dist/main.js` to Home Assistant `/config/www/your-directory/main.js` 
    * add resource to dashboard
      * resource type: JavaScript module
      * url: `/local/your-directory/main.js`

## UPLOAD/BROWSE EXISTING IMAGES
<div align="center">
  <img src=https://github.com/iva-stolnik/interactive-image-card/assets/30315220/efccc116-1e41-4e01-aa87-520a910c4997" alt="Capture11"/>
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/e9cb792a-1d46-4373-a32e-410593341204" alt="Capture10"/>
</div>

## CARD EXAMPLE IN LOVELACE DASHBOARD
<div align="center">
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/e83a73a3-73a0-485a-bde7-21582c5e27a5" alt="Capture8"/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/iva-stolnik/interactive-image-card/assets/30315220/25591daf-8fb4-4684-b642-e6a63cae515f" alt="Capture8"/>
</div>

### YAML config for card above
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

### CARD WITH IMAGE AND INTERACTIVE AREAS
uploaded image with interactive area:
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

dynamic vacuum map with interactive area:
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

camera stream with interactive area:
```
// ptz service and service data can be added only in YAML

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
