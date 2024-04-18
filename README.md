
# Custom Interactive Image Card for Home Assistant Lovelace

**custom:interactive-image-card** is a custom card for Home Assistant lovelace dashboard with support for image upload, view and interactive areas creation



# interactive maker is still in development phase!!! but feel free to try it 
  * copy code from **/src/** to **/config/www/your-directory** 
  * add resource to dashboard 
    ```
    /local/your-directory/interactive-image-maker.js
    ```
  * add interactive-image-card to dashboard 
  * YAML editing works good

## CARD EXAMPLE IN LOVELACE DASHBOARD
![Capture8](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/19e7713a-d995-4c05-b6b9-ee76614d8384)

## FEATURES
* UPLOAD or LINK EXTERNAL image
* Use entity state or attribute for DYNAMIC VIEW STREAMING 
* Use card to show SIMPLE or INTERACTIVE image
* Interactive image maker available when card has config --> editable: true
  * Add image, entity, draw interactive clickable areas to call services when clicked
  * Images and interactive areas are scalable and resizable
  * Interactive areas can be toggled to become visible on main view of card
  * Maker mode 
    * Existing tab - specific areas can be toggled
    * Add new tab - add action name, entity_id, service which will be called and draw interactive area on image in order to save new area



## NOTES
* Url can be added manually, but if no url is specified, upload input will be shown
* Image will be uploaded to /config/image/ directory
    * After uploading is complete, img url will be automatically saved to card YAML 
    * Notification to refresh dashboard will be shown
* Multiple cards can share the same label and all cards with the same label on current dashboard (all views included) will be updated with newly created actions
    * Cards with the same label should always have the same url in order for this to work
    * Cards can share url and have different label, in this case new actions wont added to other cards with same url
    * When deleting card or url in card YAML, image will be deleted from /config/image/ if no other card in the same dashboard (all views included) shares the same label
* Actions can only be removed for a specific card in its own card YAML
* Each card can have different size and all interactive areas will be scaled up, resized and reusable within the same dashboard (all views included)
* Interactive-image-card should be used on its own as independent card, cards like grid that can contain multiple cards are currently not supported and various issues might occur

## OPTIONS

| Name              | Type    | Requirement  | Default             | Description                                 |
| ----------------- | ------- | ------------ | ------------------- | ------------------------------------------- |
| type              | string  | Required |                     | custom:interactive-image-card
| label             | string  | Required |                     | card label
| editable          | boolean | Optional |                     | when enabled interactive editor will be accessible
| url               | string  | Optional |                     | image url 
| entity_state      | string  | Optional |                     | entity_id
| stream_source     | string  | Optional |                     | entity_id (not tested)
| still_image_url   | string  | Optional |                     | entity_id (not tested)
| entity_picture    | string  | Optional |                     | entity_id
| stream            | boolean | Optional |                     | add when streaming camera with entity_picture 
| size              | string  | Optional |  300                | image width in px
| use_vibration     | boolean | Optional |                     | vibration feedback when interactive area is clicked
| interactive-areas | list    | Optional |                     | list of areas on the image that trigger specified actions. Each area includes properties like `name`, `entity_id`, `points`, `service`, `confirm_service` and `service_data` |

## SOURCE YAML CONFIGURATIN
If none of these sources is added to card YAML, upload button will be shown
```
// url - manual setup or selfpopulated when uploading image
url: /api/image/serve/6c47edc8f4545bfb376ad54ba9a16326/512x512

// url is fetched from entity.state
entity_state: entity_id

// url is fetched from entity.attributes.entity_picture attribute
// tested on imou ranger 2 cam (frontend_stream_type: hls)
entity_picture: entity_id
stream: true // add when streaming camera

// url is fetched from entity.attributes.stream_source attribute
// not tested
stream_source: entity_id 


// url is fetched from entity.attributes.still_image_url attribute
// not tested
still_image_url: entity_id 
```

## ADDITIONAL OPTIONS INFO

```
// optionally add editable prop right away to gain access to interactive image maker
// so there is no need to reconfigure card manually later on
editable: true

// image width in px, default is 300px
size: 400 

// show interactive areas/edit button
// when enabled interactive editor will be accessible
// otherwise it will only show image and/or interactive areas will be clickable if existing 
editable: true/false

// vibration feedback when interactive area is clicked
use_vibration: true/false

// points are selfpopulated when using interactive editor to create interactive area, can be added/adjusted manually in YAML 
interactive-areas:                                                  
  - name: toggle office light                // required
    entity_id: light.wl_office_1             // required
    points: 0,0, 100,0, 100,100, 0,100, 0,0  // required
    service: toggle                          // required   
    confirm_service: true                    // optional, confirm modal for sensitive actions
    service_data: any                        // optional, editable only in card YAML
```


# CARD YAML EXAMPLES:

## SIMPLE CARD WITH IMAGE ONLY
uploaded:
```
type: custom:interactive-image-card
url: /api/image/serve/6c47edc8f4545bfb376ad54ba9a16326/512x512
label: Living room
```
linked:
```
type: custom:interactive-image-card
url: https://design.home-assistant.io/images/brand/logo.png
label: HA logo
```

## CARD WITH IMAGE AND INTERACTIVE AREAS
uploaded image with interactive area:
```
type: custom:interactive-image-card
url: /api/image/serve/6c47edc8f4545bfb376ad54ba9a16326/512x512
label: Living room
size: 400
editable: true
use_vibration: true
interactive_areas:
  - name: toggle table light
    entity_id: light.wl_table
    points: 0,0, 100,0, 100,100, 0,100, 0,0
    service: turn_on
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
label: vacuum
size: 300
editable: true
use_vibration: true
interactive_areas:
  - name: send home
    entity_id: vacuum.optimus_prime
    service: return_to_base
    points: 213,153,217,178,238,175,242,156
```

camera stream with interactive area:
```
// ptz service and service data can be added only in YAML

type: custom:interactive-image-card
label: camera 
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

## VISUAL EXAMPLES:

### Simple image card, editable: false
![Capture9](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/307084dc-83fc-4450-a3ee-4363c9745680)

### Image card with clickable interactive area (red coloured)
![Capture2](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/1ed77c01-9489-49f9-8ce0-f0a642103b53)
* toggle-switch icon - hide/show areas
* pencil icon - open interactive image maker

### Interactive image maker - show/hide existing area
![Capture3](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/b06c76a7-f8dc-4b70-8c24-4400367d754e)

![Capture4](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/973885d6-6436-4ba3-a0c7-aee86416ad0a)
* when there are multiple interactive areas, this feature is useful for easily identifying the corresponding actions on the image

### Interactive image maker - add new area
![Capture5](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/d4f2b7ba-8d9b-4335-8ef6-e8454bcb8129)
* draw mode - draw on image, add entity and service (service input is hidden if no valid entity is selected)
* tryout mode - try your config right away before saving, image becomes clickable

### Areas are visible on image card
![Capture6](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/ab394933-b603-45cc-8706-38ffacc390c9)

### Areas are visible in existing tab
![Capture7](https://github.com/iva-stolnik/interactive-image-card/assets/30315220/8dfc9b33-828d-473f-9e0c-322dc3453537)
