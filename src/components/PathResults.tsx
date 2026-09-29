import type { GeneratedPath } from '../types/learningPath'

const TYPE_LABEL: Record<GeneratedPath['videos'][number]['type'], string> = {
  core: 'Core',
  practice: 'Practice',
  project: 'Project',
  'deep-dive': 'Deep dive',
}

function VideoCard({
  video,
  index,
}: {
  video: GeneratedPath['videos'][number]
  index: number
}) {
  return (
    <>
      <div className="lp-thumb" aria-hidden="true">
        {video.thumbnail ? (
          <img
            className="lp-thumb-image"
            src={video.thumbnail}
            alt=""
            loading="lazy"
          />
        ) : null}
        <span className="lp-thumb-index">{index + 1}</span>
        <span className="lp-thumb-play">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M8 5.14v13.72L19.5 12 8 5.14z"
            />
          </svg>
        </span>
        <span className="lp-thumb-duration">{video.duration}</span>
      </div>
      <div className="lp-path-body">
        <div className="lp-path-tags">
          <span>Week {video.week}</span>
          <span>{TYPE_LABEL[video.type]}</span>
          {video.moduleTitle ? <span>{video.moduleTitle}</span> : null}
        </div>
        <h3>{video.title}</h3>
        <p className="lp-channel">{video.channel}</p>
        <p className="lp-reason">{video.reason}</p>
      </div>
    </>
  )
}

export default function PathResults({ path }: { path: GeneratedPath }) {
  return (
    <section
      id="path-results"
      className="lp-results"
      aria-labelledby="results-title"
    >
      <div className="lp-section-head">
        <h2 id="results-title">{path.title}</h2>
        <p>{path.summary}</p>
      </div>

      {path.modules && path.modules.length > 0 ? (
        <ol className="lp-module-list" aria-label="Curriculum modules">
          {path.modules.map((module, index) => (
            <li key={`${module.title}-${index}`}>
              <span className="lp-module-index">{index + 1}</span>
              <span className="lp-module-title">{module.title}</span>
              <span className="lp-module-meta">Week {module.week}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="lp-meta-row">
        <div>
          <span className="lp-meta-label">Duration</span>
          <strong>
            {path.weeks} week{path.weeks === 1 ? '' : 's'}
          </strong>
        </div>
        <div>
          <span className="lp-meta-label">Pace</span>
          <strong>{path.hoursPerWeek}</strong>
        </div>
        <div>
          <span className="lp-meta-label">Videos</span>
          <strong>{path.videos.length}</strong>
        </div>
      </div>

      <ol className="lp-path-list">
        {path.videos.map((video, index) => (
          <li key={video.id} className="lp-path-item">
            {video.url ? (
              <a
                className="lp-path-grid lp-path-link"
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <VideoCard video={video} index={index} />
              </a>
            ) : (
              <div className="lp-path-grid">
                <VideoCard video={video} index={index} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
