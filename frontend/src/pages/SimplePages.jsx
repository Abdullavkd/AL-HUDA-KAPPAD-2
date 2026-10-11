import React, { useEffect, useState } from 'react';
import { CalendarDays, Images, Send, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Container from '../components/common/Container';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';

function PageHero({ eyebrow, title, text }){return <section className="page-hero page-hero--compact"><Container><span className="section-heading__eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></Container></section>}
export function AboutPage(){return <div className="page-shell"><PageHero eyebrow="ABOUT AL HUDA" title={<>A trust built around <em>people and purpose.</em></>} text="Al Huda Trust brings together institutions that share a commitment to education, care and service."/><section className="section"><Container className="editorial-layout"><div><SectionHeading eyebrow="OUR STORY" title="Creating spaces where people can grow." text="Al Huda Trust is the parent organization supporting a family of institutions and community initiatives. Each institution has its own identity, while the wider trust provides a shared direction and foundation."/></div><div className="editorial-copy"><p>From education to care, our work is guided by the belief that strong communities are built when people are given the opportunity to learn, develop character and contribute.</p><p>Our institutions continue to grow with the needs of the community, carrying forward a culture of responsibility, compassion and excellence.</p></div></Container></section><section className="section section--cream"><Container className="two-column-values"><div><span className="section-heading__eyebrow">MISSION</span><h2>Education with purpose.</h2><p>To create opportunities for education, personal growth, care and meaningful service.</p></div><div><span className="section-heading__eyebrow">VISION</span><h2>A stronger future for every learner.</h2><p>To build institutions that positively shape individuals, families and the wider community.</p></div></Container></section></div>}
export function ActivitiesPage(){return <div className="page-shell"><PageHero eyebrow="LIFE AT AL HUDA" title={<>Learning goes <em>beyond the classroom.</em></>} text="Explore the activities, programs and experiences that make our institutions vibrant places to learn and grow."/><section className="section"><Container><div className="activity-grid">{['Learning & academics','Arts & culture','Sports & wellbeing','Community service','Student development','Special programs'].map((x,i)=><article className="activity-card" key={x}><span>0{i+1}</span><h3>{x}</h3><p>Programs and activities that encourage curiosity, confidence, teamwork and character.</p></article>)}</div></Container></section></div>}
export function NewsPage(){const [items,setItems]=useState([]);useEffect(()=>{api.get('/public/news').then(r=>setItems(r.data.data||[])).catch(()=>{});},[]);return <div className="page-shell"><PageHero eyebrow="NEWS & STORIES" title={<>What’s happening <em>at Al Huda.</em></>} text="Updates, achievements and stories from across the trust and its institutions."/><section className="section"><Container>{items.length?<div className="story-grid story-grid--page">{items.map(item=><article className="story-card" key={item._id}><div className="story-card__image">{item.imageUrl?<img src={item.imageUrl} alt=""/>:<div><CalendarDays size={28}/><span>AL HUDA</span></div>}</div><div className="story-card__body"><small>{item.institutionId?.name||'Al Huda Trust'}</small><h3>{item.title}</h3><p>{item.excerpt}</p></div></article>)}</div>:<Empty title="News will appear here." text="Once stories are published from the admin dashboard, they will be shown on this page."/>}</Container></section></div>}
export function EventsPage(){const [items,setItems]=useState([]);useEffect(()=>{api.get('/public/events').then(r=>setItems(r.data.data||[])).catch(()=>{});},[]);return <div className="page-shell"><PageHero eyebrow="EVENTS" title={<>Moments that bring <em>us together.</em></>} text="Keep up with upcoming programs, gatherings and important dates."/><section className="section"><Container>{items.length?<div className="event-list">{items.map(item=><article key={item._id}><div className="event-date"><CalendarDays size={20}/><strong>{new Date(item.startAt).getDate()}</strong><small>{new Date(item.startAt).toLocaleString('en',{month:'short'})}</small></div><div><small>{item.institutionId?.name||'Al Huda Trust'}</small><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>:<Empty title="Events will appear here." text="Upcoming events published by the trust will be listed here."/>}</Container></section></div>}
export function GalleryPage(){const [items,setItems]=useState([]);useEffect(()=>{api.get('/public/gallery').then(r=>setItems(r.data.data||[])).catch(()=>{});},[]);return <div className="page-shell"><PageHero eyebrow="GALLERY" title={<>A glimpse into <em>life at Al Huda.</em></>} text="Moments from classrooms, activities, celebrations and community life."/><section className="section"><Container>{items.length?<div className="gallery-grid">{items.map(item=><figure key={item._id}><img src={item.imageUrl} alt={item.caption||'Al Huda Trust'}/><figcaption>{item.caption}</figcaption></figure>)}</div>:<Empty title="Our gallery is coming soon." text="Photos and moments from our institutions will be added here." icon={<Images size={26}/>}/>}</Container></section></div>}
export function ContactPage(){const [sent,setSent]=useState(false);const [busy,setBusy]=useState(false);const submit=async e=>{e.preventDefault();setBusy(true);const form=new FormData(e.currentTarget);try{await api.post('/public/contact',Object.fromEntries(form.entries()));setSent(true);e.currentTarget.reset();}catch{}finally{setBusy(false)}};return <div className="page-shell"><PageHero eyebrow="CONTACT" title={<>We’d love to <em>hear from you.</em></>} text="For general enquiries, institutional information or partnership opportunities, get in touch with the Al Huda Trust team."/><section className="section"><Container className="contact-layout"><div><SectionHeading eyebrow="GET IN TOUCH" title="Let’s start a conversation." text="Al Huda Trust, Kappad, Kerala, India"/><div className="contact-note"><strong>General enquiries</strong><p>Phone and email details can be updated from the admin dashboard as the official contact information is finalized.</p></div></div><form className="contact-form" onSubmit={submit}>{sent&&<div className="success-message">Thank you. Your message has been received.</div>}<input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email address" required/><input name="subject" placeholder="Subject"/><textarea name="message" rows="6" placeholder="How can we help?" required/><Button icon={false}>{busy?'Sending…':<><span>Send message</span><Send size={16}/></>}</Button></form></Container></section></div>}
export function DonatePage() {
  const accountDetails = [
    ["Account name", "AL HUDA ISLAMIC CULTURAL ESTABLISHMENT AND AINUL HUDA ORPHANAGE"],
    ["Account Number", "0160073000000101"],
    ["IFSC code", "SIBL0000160"],
    ["Bank name", "The South Indian Bank Ltd."],
    ["Branch", "Chemanchery"]
];

  const copyDetail = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      alert("Copied to clipboard");
    } catch {
      alert("Unable to copy. Please copy the detail manually.");
    }
  };

  return (
    <div className="page-shell donation-page">
      <section style={{
        background: "#f5f8f5",
        padding: "46px 24px 70px",
        minHeight: "75vh"
      }}>
        <div style={{
          maxWidth: "1040px",
          margin: "0 auto"
        }}>
          <header style={{
            textAlign: "center",
            margin: "0 auto 34px",
            maxWidth: "760px"
          }}>
            <div style={{
              color: "#287365",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              marginBottom: "18px"
            }}>
              SUPPORT OUR MISSION
            </div>
            <h1 style={{
              color: "#103e35",
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.18,
              fontWeight: 750,
              margin: "0 0 20px"
            }}>
              Make a Difference Through Your Donation
            </h1>
            <p style={{
              color: "#61736d",
              fontSize: "16px",
              lineHeight: 1.7,
              margin: 0
            }}>
              Your support helps Ainul Huda Orphanage Kappad provide care, education, and a brighter future.
            </p>
          </header>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.55fr) minmax(300px, 1fr)",
            gap: "22px",
            alignItems: "stretch"
          }} className="donation-page__grid">
            <section style={{
              background: "#fff",
              border: "1px solid #dce8df",
              borderRadius: "22px",
              padding: "32px",
              boxShadow: "0 8px 30px rgba(16,62,53,0.04)"
            }}>
              <h2 style={{
                color: "#103e35",
                fontSize: "21px",
                margin: "2px 0 22px",
                fontWeight: 700
              }}>
                Bank Transfer Details
              </h2>

              {accountDetails.map(([label, value]) => (
                <div key={label} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  padding: "16px 0",
                  borderBottom: "1px solid #e3ebe5"
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontSize: "12px",
                      color: "#718078",
                      marginBottom: "8px"
                    }}>
                      {label}
                    </div>
                    <strong style={{
                      display: "block",
                      color: "#123d34",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      overflowWrap: "anywhere"
                    }}>
                      {value}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyDetail(value)}
                    style={{
                      flexShrink: 0,
                      padding: "11px 13px",
                      border: "1px solid #d5e4d9",
                      borderRadius: "10px",
                      background: "#eff5f0",
                      color: "#174b3f",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </section>

            <section style={{
              background: "#fff",
              border: "1px solid #dce8df",
              borderRadius: "22px",
              padding: "32px 26px",
              textAlign: "center",
              boxShadow: "0 8px 30px rgba(16,62,53,0.04)"
            }}>
              <h2 style={{
                color: "#103e35",
                fontSize: "21px",
                margin: "2px 0 24px",
                fontWeight: 700
              }}>
                Scan to Donate
              </h2>
              <p style={{
                color: "#53665e",
                fontSize: "15px",
                lineHeight: 1.8,
                margin: "0 auto 18px",
                maxWidth: "300px"
              }}>
                Scan with your payment app and verify the recipient name before paying.
              </p>
              <div style={{
                display: "inline-block",
                padding: "14px",
                background: "#00b638",
                lineHeight: 0,
                maxWidth: "100%"
              }}>
                <img
                  src="/donation-qr.png"
                  alt="Donation QR code"
                  style={{
                    width: "220px",
                    maxWidth: "100%",
                    height: "auto",
                    background: "#fff",
                    objectFit: "contain"
                  }}
                />
              </div>
              <p style={{
                color: "#78857e",
                fontSize: "12px",
                lineHeight: 1.7,
                margin: "18px 0 0"
              }}>
                Always verify the recipient and payment details before confirming a transaction.
              </p>
            </section>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 760px) {
          .donation-page__grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .donation-page__grid > section {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
function Empty({title,text,icon}){return <div className="empty-content empty-content--large">{icon||<span>01</span>}<div><h3>{title}</h3><p>{text}</p></div></div>}


