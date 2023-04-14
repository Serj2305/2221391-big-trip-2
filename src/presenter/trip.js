import { render, RenderPosition } from '../render.js';
import Point from '../view/point.js';
import PointEdit from '../view/point-edit.js';
import Sort from '../view/sort.js';
import TripList from '../view/trip-list.js';
import NoPointView from '../view/no-points-view.js';

class Trip{
  #component = null;
  #container = null;
  #pointsModel = null;
  #boardPoints = null;
  #destinations = null;
  #offers = null;

  constructor({container}) {
    this.#component = new TripList();
    this.#container = container;
  }

  init(pointsModel) {
    this.#pointsModel = pointsModel;
    this.#boardPoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];
    render(new Sort(), this.#container, RenderPosition.BEFOREEND);
    render(this.#component, this.#container);
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#container);
    }
    else {
      render(new Sort(), this.#container, RenderPosition.BEFOREEND);
      render(this.#component, this.#container);

      for (const point of this.#boardPoints){
        this.#renderPoint(point);
      }
  }
}

  #renderPoint = (point) => {
    const pointComponent = new Point(point, this.#destinations, this.#offers);
    const pointEditComponent = new PointEdit(point, this.#destinations, this.#offers);

    const replacePointToEditForm = () => {
      this.#component.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };

    const replaceEditFormToPoint = () => {
      this.#component.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointComponent, this.#component.element);
  };
}

export default Trip;
