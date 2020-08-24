import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/citation-preview-card';
import rdfDereferencer from "rdf-dereference";
import { storeStream } from "rdf-store-stream";
import { set, action } from "@ember/object";

/**
* Card displaying a hint of the Date plugin
*
* @module editor-citation-preview-plugin
* @class CitationPreviewCard
* @extends Ember.Component
*/
export default class CitationPreviewComponent extends Component{
  layout = layout;
  info = reads("info");

  /**
   * Region on which the card applies
   * @property location
   * @type [number,number]
   * @private
   */
  location= reads("info.location");

  /**
   * Unique identifier of the event in the hints registry
   * @property hrId
   * @type Object
   * @private
   */
  hrId = reads("info.hrId");

  /**
   * The RDFa editor instance
   * @property editor
   * @type RdfaEditor
   * @private
   */
  editor = reads("info.editor");

  /**
   * Hints registry storing the cards
   * @property hintsRegistry
   * @type HintsRegistry
   * @private
   */
  hintsRegistry= reads("info.hintsRegistry");

  referenceURL= null;

  quadsLoaded = false;

  foundQuads = null;

  @action
  insert() {
    console.log('hintsRegistry', this.hintsRegistry)
    console.log('hintsRegistry', this.hintsRegistry.removeHintsAtLocation)
    console.log('hintsRegistry', this.info.hintsRegistry)
    console.log('hintsRegistry', this.info.hintsRegistry.removeHintsAtLocation)
    
    this.info.hintsRegistry.removeHintsAtLocation(
      this.location,
      this.hrId,
      this.who
    );
    const mappedLocation = this.info.hintsRegistry.updateLocationToCurrentIndex(this.hrId, this.location);
    console.log("mappedLocation", mappedLocation)


    this.editor.replaceTextWithHTML(
      ...mappedLocation,
      '<a href="' +
        this.info.url +
        '">' +
        this.info.text +
        "</a>"
    );
  }

  @action
  insertInCard() {
    set(this, "quadsLoaded", false);
    let url = this.referenceURL;
    console.log("inserting in card:", url);
    const fetchUrl = async function (url) {
      console.log("fetching", url);
      const { quads } = await rdfDereferencer.dereference(url);
      const store = await storeStream(quads);
      const results = store.getQuads(null, null, null);
      console.log("quads", results);
      return results;
    };
    fetchUrl(url).then((quads) => {
      let foundQuads = ""
      for (let quad of quads.slice(0, 2)) { 
        console.log('quad', quad)
        foundQuads += quad.subject.value.toString() + " " + quad.predicate.value.toString() + ' ' + quad.object.value.toString() + '\n';
      }
      this.foundQuads = foundQuads;
      set(this, "quadsLoaded", true);
    });
  }

  @action
  clearLink() {
    // No button, not yet implemented.
    return null
  }
}
