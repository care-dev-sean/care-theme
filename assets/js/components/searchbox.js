'use strict';

const $       = global.jQuery;
const storage = require('../storage');
const events  = require('../events');
let self;


class SearchBox {


  constructor(el){
      self = this;
      this._el             = $(el);
      this._id             = this._el[0].id;
      this._searchField   = this._el.find('[data-behaviour="search-field"]');
      this._suggestions     = this._el.find('.Navigation-Search-Suggestions');
      this._index           = [];
      this._init();
  }

  _init() {

    console.log('initializing search box component');
    this._loadData();
    console.log(this._index);
    $(this._searchField).on('keyup', this._keyHandler);
    $(this._searchField).on('blur', this._delayedClear);
    $(this._searchField).on('focus', this._keyHandler);
    //TODO
    //
    // First
    // Read and Parse Links in navigation tree result format should be an
    // arary of objects conforming to the following spec
    // [{
    //      'label': LINK_LABEL,
    //      'description': LINK_DESCRIPTION,
    //      'url': LINK_URL
    // }]
    //
    // Second
    // Attach Event Handler To The _SearchField Element
    // This event handler should read the contents of the search field and compare them
    // to the label and description values in the navigation index defined above
    // when a set of matches is found the event should then call a rendering method to
    // update the_suggestions element
  }

  _delayedClear () {
    var update = function () {
      self._clearSuggestions();
    }
    setTimeout(update, 1000);
  }

  _keyHandler (e) {

    let input = e.target.value;

    if(input === '' || input.length < 3) {
      self._clearSuggestions();
      return;
    }

    self._filterSuggestions(input);
  }

  _clearSuggestions (e) {
    console.log('clearing suggestions');
    $(self._suggestions[0]).html('');
  }

  _filterSuggestions (input) {
    console.log('filtering suggestions');

    let filtered = this._index.filter((item)  => {
        console.log(item);
        return item.description.toLowerCase().match(input.toLowerCase());
    });
    this._writeSuggestions(filtered);
  }

  _writeSuggestions (suggestions) {
    console.log('writing suggestions');
    this._clearSuggestions();

    suggestions = suggestions.sort(this._sortByLabel);
    let suggestionBox = this._suggestions;

    suggestions.forEach((item) => {
      console.log(item.label);
      let suggestion = document.createElement('div');
      $(suggestion).attr('class', 'suggestion');

      let suggestionLink = document.createElement('a');
      let suggestionLabel = document.createElement('div');
      let suggestionDescription = document.createElement('div');

      suggestionLink.href = item.url;
      $(suggestionLink).attr('class', 'suggestion-link');

      suggestionLabel.innerHTML = item.label;
      $(suggestionLabel).attr('class', 'suggestion-label');

      suggestionDescription.innerHTML = item.description;
      $(suggestionDescription).attr('class', 'suggestion-description');

      suggestionLink.appendChild(suggestionLabel);
      suggestionLink.appendChild(suggestionDescription);

      suggestion.appendChild(suggestionLink);

      console.log(suggestion);
      console.log(suggestionBox);

      suggestionBox[0].appendChild(suggestion);
    });

  }

  _sortByLabel (a, b) {
    let label_a = a.label.toLowerCase();
    let label_b = b.label.toLowerCase();

    if(a > b)
      return -1
    else if (b > a)
      return 1
    else
      return 0;
  }

  _loadData () {
    let links = $(document).find('.Tree-entityLink');
    let outIndex = [];
    let linkIndex = $(links).each(function (idx, item) {
      let indexItem = {
        label: item.innerText.replace(/\s\s+/g, ' '),
        url: item.href,
        description: item.innerText.replace(/\s\s+/g, ' ') + ' ' + $(item).attr('data-description')
      };
      outIndex.push(indexItem);
    });
    this._index = outIndex;
  }
}

module.exports = SearchBox;
