import { Fragment } from 'react';

const STEPS = ['Мастер', 'Услуга', 'Дата и время', 'Контакты', 'Подтверждение'];

export default function Steps({ activeStep }) {
  return (
    <section className="steps" aria-label="Шаги записи">
      <ol className="steps__list">
        {STEPS.map((name, index) => {
          const number = index + 1;
          let itemClass = 'steps__item';
          if (number < activeStep) itemClass += ' steps__item--done';
          if (number === activeStep) itemClass += ' steps__item--active';

          return (
            <Fragment key={name}>
              <li className={itemClass}>
                <span className="steps__number">{number}</span>
                <span className="steps__name">{name}</span>
              </li>
              {number < STEPS.length && (
                <li
                  className={number < activeStep ? 'steps__line steps__line--done' : 'steps__line'}
                  aria-hidden="true"
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
