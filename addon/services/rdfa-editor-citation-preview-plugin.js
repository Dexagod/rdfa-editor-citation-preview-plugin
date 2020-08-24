import { getOwner } from '@ember/application';
import Service from '@ember/service';
import EmberObject from '@ember/object';
import { task } from 'ember-concurrency';
const EDITOR_CARD_NAME = 'editor-plugins/citation-preview-card';

/**
 * Service responsible for correct annotation of dates
 *
 * @module editor-citation-preview-plugin
 * @class RdfaEditorCitationPreviewPlugin
 * @constructor
 * @extends EmberService
 */
const RdfaEditorCitationPreviewPlugin = Service.extend({

  init(){
    this._super(...arguments);
    const config = getOwner(this).resolveRegistration('config:environment');
    console.log("ARGUMENTS", ...arguments)
    console.log("CONFIG", config)
    this.overWritten = false;
  },

  /**
   * task to handle the incoming events from the editor dispatcher
   *
   * @method execute
   *
   * @param {string} hrId Unique identifier of the event in the hintsRegistry
   * @param {Array} contexts RDFa contexts of the text snippets the event applies on
   * @param {Object} hintsRegistry Registry of hints in the editor
   * @param {Object} editor The RDFa editor instance
   *
   * @public
   */
  execute: task(function * (hrId, contexts, hintsRegistry, editor) {
    this.currenthrId = hrId; // TODO:: CHECK IF HOLDS ON UNDOS
    console.log("executing", contexts, "done", hrId, hintsRegistry)
    console.log("editor", editor)
    console.log("length", contexts.length)
    if (contexts.length === 0) return [];

    // if(!this.overWritten){
    //   this.overWriteSelectionHandler(editor, hintsRegistry, this.get('who'))
    //   this.overWritten = true;
    //   // TODO Remove the current hints produced by this plugin from the hints registry
    //   // See https://dev.say-editor.com/code/classes/HintsRegistry.html#method_removeHintsInRegion
    // }

    // STUB TEST BEFORE OVERWRITING TO EVENTS

    const cards = [];
    for (const context of contexts) {
      console.log("context", context)
      hintsRegistry.removeHintsInRegion(context, hrId, this.get('who'))

      // add hints for context
      // const test = /\[([^]+])\]/g;
      const regex = /\[([^\]]+)\]/g;
      let match = context.text.match(regex);
      console.log("MATCH", match)
      if (match) {
        let matches = regex.exec(match)
        console.log('matches', matches)
        match = matches[0]
        let term = matches[1]
        console.log(match, term)
        console.log(match.length, term.length)
        const matchIndex = context.text.indexOf(match);
        const location = this.normalizeLocation(
          [ matchIndex, matchIndex + match.length ],
          context.region );  // MARK?

        console.log('location', location)
        cards.push( EmberObject.create({
          info: {
            who: this.get('who'),
            text: term,
            location,
            hrId, hintsRegistry, editor
          },
          location: location,
          card: EDITOR_CARD_NAME
        }));
        console.log('cards', cards)
      }    
    }

    hintsRegistry.addHints(hrId, this.get('who'), cards )
    yield null;
  }),

  overWriteSelectionHandler(editor, hintsRegistry, who){
    let updateSelectionFunction = editor.selectionUpdate
    // let currenthrId = this.currenthrId

    editor.selectionUpdate = function(...args){
      updateSelectionFunction(args)
      let cards = [];
      if(!editor.currentSelectionIsACursor){
        console.log("SELECTION UPDATE", args)
        let hrId = hintsRegistry.index[hintsRegistry.index.length-1].idx
        // We only want to catch selection updates that select a block of text
        let location = editor.currentSelection
        console.log("selection", location)
        console.log("registry", hintsRegistry)
        console.log("index", hrId)
        cards.push(
          EmberObject.create({
            info: {
              who: who,
              text: "test",
              location,
              hrId,
              hintsRegistry,
              editor,
            },
            location: location,
            card: EDITOR_CARD_NAME,
          })
        );
        hintsRegistry.removeHintsInRegion(location, hrId, who);
        console.log("adding", cards[0])
        hintsRegistry.addHints(hrId, who, cards);
        editor.generateDiffEvents;
      }
    }
  },


  /**
   * Maps location of substring back within reference location
   *
   * @method normalizeLocation
   *
   * @param {[int,int]} [start, end] Location withing string
   * @param {[int,int]} [start, end] reference location
   *
   * @return {[int,int]} [start, end] absolute location
   *
   * @private
   */
  normalizeLocation(location, reference) {
    return [location[0] + reference[0], location[1] + reference[0]];
  }
});

RdfaEditorCitationPreviewPlugin.reopen({
  who: 'editor-plugins/citation-preview-plugin'
});
export default RdfaEditorCitationPreviewPlugin;
