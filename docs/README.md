📢 Use this project, [contribute](https://github.com/vtex-apps/store-locator) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# GeoCMS Store Locator

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The GeoCMS Store Locator app brings in location data from your [GeoCMS](https://www.noovle.com/en/geocms-geo-data-management-platform/) service and creates a store locator map, as well as, individual store pages for each location.

## Configuration

### Step 1 - Installing the Yext Store Locator

Using your terminal and [VTEX IO Toolbelt](https://vtex.io/docs/recipes/development/vtex-io-cli-installation-and-command-reference/#command-reference), log in to the VTEX account you are working on and [install](https://vtex.io/docs/recipes/store/installing-an-app) the `vtex.geocms-store-locator@0.x` app.

### Step 2 - Defining the app settings

In your VTEX account's admin, perform the following actions:

1. Access the **Apps** section and then **My Apps**.
2. Select the **GeoCMS Store Locator** app box.
3. In the Settings section, enter your **Product License**, **Project Name**, and **Signature Encryption Key** from GeoCMS.
4. Save your changes.

### Step 3 - Adding the app dependencies and store routes

Before performing the following actions, make sure you are already logged into the desired VTEX account and working on a [Developer workspace](https://vtex.io/docs/recipes/development/creating-a-development-workspace/).

1. Open your Store Theme app in your code editor.
2. Add the `geocms-store-locator` app as a `peerDependency` in your theme's `manifest.json` file:

```diff
 "peerDependencies": {
+  "vtex.geocms-store-locator": "0.x"
 }
```

> ℹ️ _This app will also **add a new entry to your store's `/sitemap.xml` file in order to have all the individual store pages available to the search engines** - make sure you already have the `vtex.store-sitemap@2.x` app installed in your VTEX account!_

3. In the `store/routes.json` file, create paths for the store locator pages as shown below:

```json
"store.storelocator": {
    "path": "/store-locator",
    "isSitemapEntry": true
},
"store.storedetail": {
	"path": "/store/:slug/:store_id"
}
```

| Store page           | Description                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `store.storelocator` | Provides a listing of your store locations along with a map and markers for the each location |
| `store.storedetail`  | A detailed view of a single store location.                                                   |

### Step 4 - Declaring the pages' blocks

The GeoCMS Store Locator app provides the following blocks for your use:

| Block name           | Description                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- |
| `store-address`      | Show the store address.                                                               |
| `store-amenities`    | Show a list of amenities available at the store.                                      |
| `store-contacts`     | Show store contact information.                                                       |
| `store-container`    | A context component that provides data for the store page's child blocks.             |
| `store-hours`        | Show the store hours.                                                                 |
| `store-image-banner` | Image carousel component to display store images.                                     |
| `store-locations`    | List of stores that are displayed on the store locations page.                        |
| `store-logo`         | Show the store logo.                                                                  |
| `store-manager`      | Show the store manager name.                                                          |
| `store-map`          | Map component to be used on the store detail page. Shows the viewed store's location. |

1. In the `store` folder of your Store Theme, create a new file called `store-locator.json`.
2. Use the example block structure below to layout your Store Locator and Store Detail pages.

```json
{
  "store.storelocator": {
    "blocks": ["flex-layout.row#title", "flex-layout.row#container"]
  },
  "flex-layout.row#title": {
    "children": ["flex-layout.col#title"]
  },
  "flex-layout.row#container": {
    "children": ["store-locations"]
  },
  "flex-layout.col#title": {
    "children": ["rich-text#title"],
    "props": {
      "blockClass": "title",
      "preventVerticalStretch": true
    }
  },
  "rich-text#title": {
    "props": {
      "text": "## Store Locator"
    }
  },
  "store.storedetail": {
    "blocks": ["store-container"]
  },
  "store-container": {
    "children": [
      "flex-layout.row#titleStore",
      "flex-layout.row#containerStore"
    ],
    "props": {
      "amenities": ["parking", "pharmacy", "laundry"]
    }
  },
  "flex-layout.row#titleStore": {
    "children": ["flex-layout.col#titleStore"],
    "props": {
      "fullWidth": true
    }
  },
  "flex-layout.col#titleStore": {
    "children": ["rich-text#titleStore"],
    "props": {
      "preventVerticalStretch": true
    }
  },
  "rich-text#titleStore": {
    "props": {
      "text": "## Store Detail"
    }
  },
  "flex-layout.row#containerStore": {
    "children": ["flex-layout.col#detail", "flex-layout.col#store"]
  },
  "flex-layout.col#detail": {
    "children": [
      "store-manager",
      "store-amenities",
      "store-map",
      "store-address",
      "store-contacts",
      "store-hours"
    ],
    "props": {
      "width": "30%",
      "preventVerticalStretch": true
    }
  },
  "flex-layout.col#store": {
    "children": ["store-image-banner"],
    "props": {
      "width": "70%",
      "horizontalAlign": "center"
    }
  }
}
```

### `store-container` props

| Prop name   | Type    | Description                                                                                | Default value |
| ----------- | ------- | ------------------------------------------------------------------------------------------ | ------------- |
| `amenities` | `array` | Array of strings declaring the GeoCMS property names that represent the store's amenities. | `undefined`   |

### `store-locations` props

| Prop name    | Type     | Description                                                                                                   | Default value |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------- | ------------- |
| `icon`       | `string` | Image url (svg or png) to be used as the map location marker icon instead of the default red Google pin icon. | `undefined`   |
| `iconWidth`  | `number` | If a custom icon is used, a fixed width number in pixels can be set                                           | `undefined`   |
| `iconHeight` | `number` | If a custom icon is used, a fixed height number in pixels can be set                                          | `undefined`   |

### `store-logo` props

| Prop name | Type     | Description           | Default value |
| --------- | -------- | --------------------- | ------------- |
| `width`   | `string` | Logo container width  | `300px`       |
| `height`  | `string` | Logo container height | `300px`       |

### `store-map` props

| Prop name    | Type     | Description                                                                                                   | Default value |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------- | ------------- |
| `width`      | `string` | Map container width                                                                                           | `undefined`   |
| `height`     | `string` | Map container height                                                                                          | `undefined`   |
| `icon`       | `string` | Image url (svg or png) to be used as the map location marker icon instead of the default red Google pin icon. | `undefined`   |
| `iconWidth`  | `number` | If a custom icon is used, a fixed width number in pixels can be set                                           | `undefined`   |
| `iconHeight` | `number` | If a custom icon is used, a fixed height number in pixels can be set                                          | `undefined`   |

## Customization

`In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).`

| CSS Handles                     |
| ------------------------------- |
| `addressContainer`              |
| `addressBlock`                  |
| `addressDirectionsContainer`    |
| `addressDirectionsLink`         |
| `amenitiesContainer`            |
| `amenitiesLabel`                |
| `amenitiesList`                 |
| `amenitiesItem`                 |
| `storeListAddressList`          |
| `storeListAddressListFirstItem` |
| `storeListAddressListItem`      |
| `storeListStoreLinkContainer`   |
| `storeListStoreLink`            |
| `storeListAddressContainer`     |
| `storeListAddress`              |
| `storeListLinks`                |
| `storeListLinkContainer`        |
| `storeListPhoneLink`            |
| `storeListDirectionsLink`       |
| `storeListEmptyState`           |
| `contactsContainer`             |
| `contactsContact`               |
| `contactsLabel`                 |
| `hoursContainer`                |
| `hoursNormalHours`              |
| `hoursHolidayHours`             |
| `hoursLabel`                    |
| `hoursHolidayHoursLabel`        |
| `hoursRow`                      |
| `hoursDayOfWeek`                |
| `hoursText`                     |
| `imageBannerListItem`           |
| `imageBannerContainer`          |
| `locationsBlock`                |
| `locationsSearchContainer`      |
| `locationsSearchInput`          |
| `locationsSearchSpinner`        |
| `locationsContainer`            |
| `locationsMapContainer`         |
| `locationsMap`                  |
| `logoContainer`                 |
| `managerContainer`              |
| `managerContact`                |
| `managerLabel`                  |
| `mapContainer`                  |
| `markerInfo`                    |
| `markerInfoLinkContainer`       |
| `markerInfoLink`                |
| `markerInfoAddressStreet`       |
| `markerInfoAddress`             |
| `markerInfoHours`               |
| `markerInfoDirectionsLink`      |
| `markerInfoStoreName`           |
| `markerInfoAddress`             |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->

---

Check out some documentation models that are already live:

- [Breadcrumb](https://github.com/vtex-apps/breadcrumb)
- [Image](https://vtex.io/docs/components/general/vtex.store-components/image)
- [Condition Layout](https://vtex.io/docs/components/all/vtex.condition-layout@1.1.6/)
- [Add To Cart Button](https://vtex.io/docs/components/content-blocks/vtex.add-to-cart-button@0.9.0/)
- [Store Form](https://vtex.io/docs/components/all/vtex.store-form@0.3.4/)

**Upcoming documentation:**

- [Add store blocks; Add messages](https://github.com/vtex-apps/geocms-store-locator/pull/1)
- [Fix app settings](https://github.com/vtex-apps/geocms-store-locator/pull/2)
