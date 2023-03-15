import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup is string is returned if render=false
   * @this {Object} View instance
   * @author Jin Kim
   * @todo Finish implementation
   */
  render(data, render = true) {
    //if data is not an array, empty, or is nonexistent, return (exit) and then renderError()
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); //updated data as plain HTML as a string

    const newDOM = document.createRange().createContextualFragment(newMarkup); //converts string into real DOM node objects (to compare with the original)

    const newElements = Array.from(newDOM.querySelectorAll('*')); //selects all elements in newDOM (basically the new DOM that would be rendered on the page if we were to have used .render() instead - thus, contains all the changes made)
    // console.log(newElements);

    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    ); //current data to be changed
    // console.log(currentElements);

    //the comparison and corresponding mutation
    newElements.forEach((newEl, i) => {
      const currentEl = currentElements[i];
      // console.log(currentEl, newEl.isEqualNode(currentEl));

      //we check for nodeValue bc we want to change only elements that contain TEXT! Not the entire thing, which will be modified if not for nodeValue (returns only textContent if it has textContent, else, mostly null)
      //UPDATES CHANGED TEXT
      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        currentEl.textContent = newEl.textContent;
      }

      //UPDATES CHANGED ATTRIBTES
      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currentEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
