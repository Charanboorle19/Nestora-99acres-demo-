import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../../data/requirements'

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`hrp-screen-section hrp-testimonials ${isVisible ? 'hrp-testimonials-visible' : ''}`}
      aria-labelledby="testimonials-title"
    >
      <div className="hrp-testimonials-header">
        <span>Owner &amp; investor trust</span>
        <h2 id="testimonials-title" className="hrp-display">Verified deal testimonials</h2>
      </div>

      <div className="hrp-testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="hrp-testimonial-card" key={testimonial.id}>
            <div className="hrp-testimonial-stars" aria-hidden="true">
              <span>★★★★★</span>
            </div>
            <span className="hrp-sr-only">5 out of 5 stars</span>
            <blockquote>“{testimonial.quote}”</blockquote>
            <div className="hrp-testimonial-divider" />
            <h3 className="hrp-display">{testimonial.name}</h3>
            <p>{testimonial.role}</p>
          </article>
        ))}
      </div>

      <p className="hrp-testimonials-caption">Sample testimonials for demo purposes</p>
    </section>
  )
}