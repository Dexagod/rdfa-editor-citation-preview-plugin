ember-rdfa-editor-citation-preview-plugin
==============================================================================

This is an addon for the [Say Editor](http://say-editor.com/) project.
This addon allows the user to reference a source for a section of text, 
and to include data from the referenced source directly into the text.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------
This library is an addon for the [say-editor](https://say-editor.com/) 
To test this addon, you can find a demo-suite for the say editor on:
https://github.com/lblod/frontend-rdfa-editor-demo.

It can be installed using:
```
git clone https://github.com/lblod/frontend-rdfa-editor-demo
cd frontend-rdfa-editor-demo
npm install -g ember-cli
npm install
```

After installing the demo for the say-editor, you can run it using:
```
npm run start
```


With a working instance of the say-editor, you can now use this plugin.
As the plugin is currently still in development, it is not yet published on npm.
You can install it locally as follows:
```
git clone https://github.com/Dexagod/rdfa-editor-citation-preview-plugin.git
cd rdfa-editor-citation-preview-plugin
npm install
```

Now the plugin package needs to be added to the editor demo as a dependency.
The most straightforward way is to add it as a local dependency to the editor demo.
This can be done by adding it as a dependency in the package.json or by using npm.
```
  in package.json:

  "dependencies": {
    "ember-rdfa-editor-citation-preview-plugin": "/path/to/ember-rdfa-editor-citation-preview-plugin/"
  }
  
  or:
  
  npm install /path/to/ember-rdfa-editor-citation-preview-plugin/
```

Finally, the plugin can be enabled in ```/app/config/editor-profiles.js```
```
export default {
  default: [
    "rdfa-editor-citation-preview-plugin"
  ]
};
```

Usage
------------------------------------------------------------------------------
In the editor, the plugin can be used to reference a source, and include rdf metadata from that source into the document.
This is done by wrapping the text you want to reference a source for in square brackets:
```
This is an [example of text that references a source] to include metadata from that source.
```

This brings up a card that allows a url to be passed to motivates the selected section of the text.
On confirmation, the card will retrieve the RDF data available on the passed url source, and preview the data that will be inserted in the text.

[in progress] Now the user can write a section of text, including the rdf data that was retrieved from the source in this section, with the correct numbers automatically being filled in.





Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
