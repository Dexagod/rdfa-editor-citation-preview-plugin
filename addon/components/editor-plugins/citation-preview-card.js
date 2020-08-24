/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../../templates/components/editor-plugins/citation-preview-card';
import rdfDereferencer from "rdf-dereference";
import { storeStream } from "rdf-store-stream";
import { set } from "@ember/object";

const CITO = "http://purl.org/spar/cito/";
/**
* Card displaying a hint of the Date plugin
*
* @module editor-citation-preview-plugin
* @class CitationPreviewCard
* @extends Ember.Component
*/
export default Component.extend({
  layout,

  /**
   * Region on which the card applies
   * @property location
   * @type [number,number]
   * @private
   */
  location: reads("info.location"),

  /**
   * Unique identifier of the event in the hints registry
   * @property hrId
   * @type Object
   * @private
   */
  hrId: reads("info.hrId"),

  /**
   * The RDFa editor instance
   * @property editor
   * @type RdfaEditor
   * @private
   */
  editor: reads("info.editor"),

  /**
   * Hints registry storing the cards
   * @property hintsRegistry
   * @type HintsRegistry
   * @private
   */
  hintsRegistry: reads("info.hintsRegistry"),

  referenceURL: null,

  quadsLoaded: false,

  foundQuads: null,

  selectionTypes: [
    { value: "cito:cites", label: "selection cites from link" },
    { value: "cito:isAgreedWithBy", label: "link agrees with selection" },
    { value: "cito:isDisagreedWithBy", label: "link disagrees with selection" },
    { value: "cito:isSupportedBy", label: "link supports selection" },
    { value: "cito:isDiscussedBy", label: "link discusses selection" },
  ],

  selectedOption: null,

  actions: {
    insert() {
      let url = this.get('referenceURL')
      let text = this.get('info').text
      console.log('TEST', url, text)
      this.get("hintsRegistry").removeHintsAtLocation(
        this.get("location"),
        this.get("hrId"),
        this.get("who")
      );
      const mappedLocation = this.get(
        "hintsRegistry"
      ).updateLocationToCurrentIndex(this.get("hrId"), this.get("location"));

      this.get("editor").replaceTextWithHTML(
        ...mappedLocation,
        generateHTML(url, text, this.get('selectedOption')).outerHTML
      );
    },
    insertInCard() {
      if (!this.selectedOption) { 
        return;
      }
      set(this, "quadsLoaded", false);
      let url = this.get("referenceURL");
      console.log("inserting in card:", url);
      const fetchUrl = async function (url) {
        console.log("fetching", url);
        const { quads } = await rdfDereferencer.dereference(url);
        const store = await storeStream(quads);
        // const results = store.getQuads(null, null, null);
        // This gives nicer quad examples for demo
        const results = store.getQuads(url, null, null); 
        console.log("quads", results);
        return results;
      };
      fetchUrl(url).then((quads) => {
        let quadString = ""
        for (const quad of quads.slice(0, 3)) {
          console.log("quad", quad);
          quadString += createDemoString(quad.predicate.value) + ' - ' + quad.object.value.toString() + '\n' 
        }
        this.foundQuads = quadString;
        set(this, "quadsLoaded", true);
      });
    },
    clearLink() {
      // No button, not yet implemented behavior
      return null;
    },
    setSelection: function (selected) {
      this.set("selectedOption", selected);
      console.log(this.get("selectedOption"));
    },
  },
});

function createDemoString(s) { 
  const splitS = s.split('/')
  const val = splitS[splitS.length - 1]
  const splitVal = val.split('#')
  return splitVal[splitVal.length - 1]
}

function generateHTML(url, label, citationType) { 
  let a = document.createElement('a')
  a.setAttribute('href', url)
  let span = document.createElement('span')
  span.setAttribute('prefix', CITO)
  span.setAttribute('property', citationType)
  span.setAttribute('resource', url)
  span.setAttribute('data-editor-position-level', 0)
  span.setAttribute('data-editor-rdfa-position-level', 0)
  span.innerText = label
  a.appendChild(span)
  return(a)
}