import { useId, useState, type FormEvent } from 'react'
import {
  CREATOR_OPTIONS,
  EXCLUDE_OPTIONS,
  GOAL_EXAMPLES,
  INCLUDE_OPTIONS,
  requestLearningPath,
  TEACHING_STYLE_OPTIONS,
  VIDEO_LENGTH_OPTIONS,
} from '../lib/generatePath'
import type {
  CreatorPreference,
  ExcludeFilter,
  GeneratedPath,
  IncludeFilter,
  LearningPathForm,
  TeachingStyle,
  VideoLength,
} from '../types/learningPath'
import PathResults from '../components/PathResults'

const INITIAL: LearningPathForm = {
  topic: '',
  skillLevel: '',
  learningGoal: '',
  videoLengths: [],
  teachingStyles: [],
  creatorPreferences: [],
  timePerWeek: '',
  timeline: '',
  excludeFilters: [],
  includeFilters: [],
  maxVideoAgeYears: 3,
  preferredLanguage: 'English',
}

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export default function LearningPathPage() {
  const formId = useId()
  const [form, setForm] = useState<LearningPathForm>(INITIAL)
  const [path, setPath] = useState<GeneratedPath | null>(null)
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.topic.trim()) {
      setError('Add a topic to generate your path.')
      return
    }
    if (!form.skillLevel) {
      setError('Choose your current skill level.')
      return
    }

    setError('')
    setGenerating(true)
    setPath(null)

    try {
      const nextPath = await requestLearningPath(form)
      setPath(nextPath)
      window.requestAnimationFrame(() => {
        document.getElementById('path-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not generate your learning path. Please try again.',
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="lp-page">
      <div className="lp-grain" aria-hidden="true" />
      <header className="lp-nav">
        <a className="lp-brand" href="#top" aria-label="Pathly home">
          <img
            className="lp-brand-mark"
            src="/pathly-mark.png"
            alt=""
            width={36}
            height={35}
          />
          <span className="lp-brand-text">Pathly</span>
        </a>
        <a className="lp-nav-cta" href="#builder">
          Build path
        </a>
      </header>

      <main id="top">
        <section className="lp-hero" aria-labelledby="hero-brand">
          <div className="lp-hero-stage" aria-hidden="true">
            <div className="lp-hero-glow" />
            <div className="lp-hero-grid" />
            <div className="lp-hero-player">
              <div className="lp-hero-bars">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="lp-hero-play">
                <img
                  src="/pathly-mark.png"
                  alt=""
                  width={96}
                  height={93}
                />
              </div>
              <div className="lp-hero-timeline">
                <i />
              </div>
            </div>
          </div>

          <div className="lp-hero-copy">
            <div className="lp-hero-brand-row">
              <img
                className="lp-hero-logo"
                src="/pathly-logo.png"
                alt=""
                width={72}
                height={70}
              />
              <h1 id="hero-brand" className="lp-brand-hero">
                Pathly
              </h1>
            </div>
            <p className="lp-hero-headline">
              Turn endless videos into a path that fits how you learn.
            </p>
            <p className="lp-hero-sub">
              Set your topic, level, style, and schedule — get a curated
              YouTube sequence instead of a rabbit hole.
            </p>
            <div className="lp-hero-actions">
              <a className="lp-btn lp-btn-primary" href="#builder">
                Start building
              </a>
            </div>
          </div>
        </section>

        <section
          id="builder"
          className="lp-builder"
          aria-labelledby="builder-title"
        >
          <div className="lp-section-head">
            <h2 id="builder-title">Build your learning path</h2>
            <p>Answer once. Generate a path tuned to your pace and taste.</p>
          </div>

          <form className="lp-form" onSubmit={onSubmit} noValidate>
            <fieldset className="lp-block">
              <legend>What do you want to learn</legend>

              <label className="lp-field" htmlFor={`${formId}-topic`}>
                <span>Topic</span>
                <input
                  id={`${formId}-topic`}
                  type="text"
                  placeholder='e.g., "React", "Spanish", "Digital Marketing", "Piano"'
                  value={form.topic}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, topic: e.target.value }))
                  }
                  autoComplete="off"
                />
              </label>

              <label className="lp-field" htmlFor={`${formId}-level`}>
                <span>Current skill level</span>
                <select
                  id={`${formId}-level`}
                  value={form.skillLevel}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      skillLevel: e.target.value as LearningPathForm['skillLevel'],
                    }))
                  }
                >
                  <option value="">Select level</option>
                  <option value="Complete Beginner">Complete Beginner</option>
                  <option value="Some Basics">Some Basics</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced (filling gaps)">
                    Advanced (filling gaps)
                  </option>
                </select>
              </label>

              <label className="lp-field" htmlFor={`${formId}-goal`}>
                <span>Learning goal</span>
                <textarea
                  id={`${formId}-goal`}
                  rows={3}
                  placeholder="Why are you learning this? What do you want to be able to do?"
                  value={form.learningGoal}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, learningGoal: e.target.value }))
                  }
                />
              </label>

              <div className="lp-examples" aria-label="Goal examples">
                <span className="lp-examples-label">Examples</span>
                <ul>
                  {GOAL_EXAMPLES.map((example) => (
                    <li key={example}>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({ ...f, learningGoal: example }))
                        }
                      >
                        {example}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </fieldset>

            <fieldset className="lp-block">
              <legend>Learning preferences</legend>

              <div className="lp-check-group">
                <p className="lp-group-label">Video length preference</p>
                <div className="lp-checks">
                  {VIDEO_LENGTH_OPTIONS.map((opt) => (
                    <label key={opt.value} className="lp-check">
                      <input
                        type="checkbox"
                        checked={form.videoLengths.includes(opt.value)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            videoLengths: toggleValue(
                              f.videoLengths,
                              opt.value as VideoLength,
                            ),
                          }))
                        }
                      />
                      <span>
                        {opt.value}
                        <small> — {opt.hint}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lp-check-group">
                <p className="lp-group-label">Teaching style preference</p>
                <div className="lp-checks">
                  {TEACHING_STYLE_OPTIONS.map((opt) => (
                    <label key={opt} className="lp-check">
                      <input
                        type="checkbox"
                        checked={form.teachingStyles.includes(opt)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            teachingStyles: toggleValue(
                              f.teachingStyles,
                              opt as TeachingStyle,
                            ),
                          }))
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="lp-check-group">
                <p className="lp-group-label">Creator preference</p>
                <div className="lp-checks">
                  {CREATOR_OPTIONS.map((opt) => (
                    <label key={opt} className="lp-check">
                      <input
                        type="checkbox"
                        checked={form.creatorPreferences.includes(opt)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            creatorPreferences: toggleValue(
                              f.creatorPreferences,
                              opt as CreatorPreference,
                            ),
                          }))
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            <fieldset className="lp-block">
              <legend>Time commitment</legend>

              <div className="lp-row">
                <label className="lp-field" htmlFor={`${formId}-hours`}>
                  <span>How much time per week?</span>
                  <select
                    id={`${formId}-hours`}
                    value={form.timePerWeek}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        timePerWeek: e.target
                          .value as LearningPathForm['timePerWeek'],
                      }))
                    }
                  >
                    <option value="">Select hours</option>
                    <option value="2-3 hours">2-3 hours</option>
                    <option value="3-5 hours">3-5 hours</option>
                    <option value="5-10 hours">5-10 hours</option>
                    <option value="10+ hours">10+ hours</option>
                  </select>
                </label>

                <label className="lp-field" htmlFor={`${formId}-timeline`}>
                  <span>Timeline to complete</span>
                  <select
                    id={`${formId}-timeline`}
                    value={form.timeline}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        timeline: e.target
                          .value as LearningPathForm['timeline'],
                      }))
                    }
                  >
                    <option value="">Select timeline</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="No rush">No rush</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="lp-block">
              <legend>Content filters</legend>

              <div className="lp-check-group">
                <p className="lp-group-label">Exclude</p>
                <div className="lp-checks">
                  {EXCLUDE_OPTIONS.map((opt) => (
                    <label key={opt} className="lp-check">
                      <input
                        type="checkbox"
                        checked={form.excludeFilters.includes(opt)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            excludeFilters: toggleValue(
                              f.excludeFilters,
                              opt as ExcludeFilter,
                            ),
                          }))
                        }
                      />
                      <span>
                        {opt === 'Videos over X years old'
                          ? 'Videos over X years old (outdated content)'
                          : opt === 'Non-English'
                            ? 'Non-English (or specify language)'
                            : opt}
                      </span>
                    </label>
                  ))}
                </div>

                {form.excludeFilters.includes('Videos over X years old') && (
                  <label
                    className="lp-field lp-field-inline"
                    htmlFor={`${formId}-age`}
                  >
                    <span>Max age (years)</span>
                    <input
                      id={`${formId}-age`}
                      type="number"
                      min={1}
                      max={20}
                      value={form.maxVideoAgeYears}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          maxVideoAgeYears: Number(e.target.value) || 1,
                        }))
                      }
                    />
                  </label>
                )}

                {form.excludeFilters.includes('Non-English') && (
                  <label
                    className="lp-field lp-field-inline"
                    htmlFor={`${formId}-lang`}
                  >
                    <span>Preferred language</span>
                    <input
                      id={`${formId}-lang`}
                      type="text"
                      value={form.preferredLanguage}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          preferredLanguage: e.target.value,
                        }))
                      }
                      placeholder="English"
                    />
                  </label>
                )}
              </div>

              <div className="lp-check-group">
                <p className="lp-group-label">Include</p>
                <div className="lp-checks">
                  {INCLUDE_OPTIONS.map((opt) => (
                    <label key={opt} className="lp-check">
                      <input
                        type="checkbox"
                        checked={form.includeFilters.includes(opt)}
                        onChange={() =>
                          setForm((f) => ({
                            ...f,
                            includeFilters: toggleValue(
                              f.includeFilters,
                              opt as IncludeFilter,
                            ),
                          }))
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>

            {error ? (
              <p className="lp-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="lp-submit">
              <button
                type="submit"
                className="lp-btn lp-btn-youtube"
                disabled={generating}
                aria-busy={generating}
              >
                {generating ? 'Generating…' : 'Generate Learning Path'}
              </button>
              {generating ? (
                <p className="lp-generating" role="status" aria-live="polite">
                  Building your curriculum and finding YouTube videos…
                </p>
              ) : null}
            </div>
          </form>
        </section>

        {path ? <PathResults path={path} /> : null}
      </main>

      <footer className="lp-footer">
        <p>
          <img
            className="lp-footer-mark"
            src="/pathly-mark.png"
            alt=""
            width={22}
            height={21}
          />
          <span className="lp-brand-text">Pathly</span> — learn with intention,
          not infinite scroll.
        </p>
      </footer>
    </div>
  )
}
