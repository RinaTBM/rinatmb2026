import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Check } from 'lucide-react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-cream-50 pt-28 md:pt-32">
      <section className="py-16 md:py-24 text-center">
        <div className="container-lux max-w-2xl">
          <p className="eyebrow mb-3">Get in touch</p>
          <h1 className="font-serif text-5xl md:text-6xl text-ink-900 mb-4">Contact Us</h1>
          <p className="text-ink-500 mb-8">
            Questions about your order, a product, or your therapy? Our care team is here to help — typically
            responding within one business day.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-lux max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            {/* Contact info */}
            <div className="space-y-4">
              <div className="card-lux p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <Mail size={20} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">Email</p>
                  <p className="text-sm text-ink-500">info@thebaremethodmn.com</p>
                </div>
              </div>
              <div className="card-lux p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <Phone size={20} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">Phone</p>
                  <p className="text-sm text-ink-500">(218) 656-7189</p>
                  <p className="text-xs text-ink-400 mt-0.5">Mon–Fri, 9am–6pm ET</p>
                </div>
              </div>
              <div className="card-lux p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <MessageCircle size={20} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">Live Chat</p>
                  <p className="text-sm text-ink-500">Available in your account dashboard</p>
                </div>
              </div>
              <div className="card-lux p-6 flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gold-100">
                  <MapPin size={20} className="text-gold-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-900 mb-0.5">Mailing Address</p>
                  <p className="text-sm text-ink-500">My Bare Method<br />15115 Cedar Ave Suite 33<br />Apple Valley, MN 55124</p>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="card-lux p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <Check size={30} className="text-green-600" />
                  </div>
                  <h2 className="font-serif text-2xl text-ink-900 mb-2">Message Sent</h2>
                  <p className="text-ink-500 max-w-sm">
                    Thank you for reaching out. Our care team will respond within one business day.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-outline mt-6">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-ink-800 mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="input-lux"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-800 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="input-lux"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-800 mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="input-lux"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Question</option>
                      <option value="product">Product Inquiry</option>
                      <option value="therapy">Therapy & Intake</option>
                      <option value="membership">Membership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-800 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="input-lux resize-none"
                      placeholder="How can we help?"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Send Message <Send size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
