
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



# FEATURES
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



## Required minimal YAML configuration
```
type: custom:interactive-image-card
label: Living room

// optionally add editable prop right away to gain access to interactive image maker
// so there is no need to reconfigure card manually later on
editable: true
```

## SOURCE YAML configuration
If none of these sources is added to card YAML, upload button will be shown
```
// url - manual setup or selfpopulated when uploading image
url: /api/image/serve/6c4545bfb376ad54ba9a163267edc8f4/512x512

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

## Optional YAML configuration

```
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
  - name: toggle office light
    entity_id: light.wl_office_1
    points: 0,0, 100,0, 100,100, 0,100, 0,0
    service: toggle                   
    confirm_service: true/false // confirm modal for sensitive actions
    service_data: // supported, editable only in card YAML
```


# Config examples

## SIMPLE CARD WITH IMAGE ONLY
```
// uploaded
type: custom:interactive-image-card
url: /api/image/serve/6c4545bfb376ad54ba9a163267edc8f4/512x512
label: Living room

// linked
type: custom:interactive-image-card
url: https://design.home-assistant.io/images/brand/logo.png
label: HA logo
```

## CARD WITH IMAGE AND INTERACTIVE AREA
### uploaded image with interactive area
```
type: custom:interactive-image-card
url: /api/image/serve/6c4545bfb376ad54ba9a163267edc8f4/512x512
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
### dynamic vacuum map with interactive area
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

### camera stream with interactive area
```
// service and service data are editable only in YAML for this kind of card 
// points can be added with any other entity and service and updated manually later on
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
