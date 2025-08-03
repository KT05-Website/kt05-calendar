"use client"

import React, { useState } from "react"
import SneakerSelection from "./sneakerselection"
import PackageSelection from "./packageselection"
import ShoeOptions from "./shoeoptions"
import WordCountBox from "./wordcountbox"
import ImageAttachment from "./imageattachment"
import ContactDetails from "./contactdetails"

export default function DesignYourOwnPage() {
    const [sneaker, setSneaker] = useState("")
    const [packageOption, setPackageOption] = useState("")
    const [description, setDescription] = useState("")
    const [images, setImages] = useState<File[]>([])
    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
    })
    const [shoeSize, setShoeSize] = useState("")
    const [laceColor, setLaceColor] = useState("")
    const [isContactValid, setIsContactValid] = useState(false)

    // Redirect to calendar page
    const handleRedirect = () => {
        window.location.assign(
            "https://friendly-cuchufli-ad7d31.netlify.app/calendar"
        )
    }

    return (
        <div
            style={{
                fontFamily: "Inter, sans-serif",
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            {/* Sneaker Selection */}
            <section style={{ marginBottom: "50px" }}>
                <SneakerSelection value={sneaker} onChange={setSneaker} />
            </section>

            {/* Package + Shoe Options */}
            <section style={{ marginBottom: "50px" }}>
                <PackageSelection value={packageOption} onChange={setPackageOption} />
                <ShoeOptions
                    size={shoeSize}
                    onSizeChange={setShoeSize}
                    laceColor={laceColor}
                    onLaceColorChange={setLaceColor}
                />
            </section>

            {/* Description + Image Upload */}
            <section style={{ marginBottom: "50px" }}>
                <WordCountBox value={description} onChange={setDescription} />
                <div style={{ marginTop: "20px" }}>
                    <ImageAttachment value={images} onChange={setImages} />
                </div>
            </section>

            {/* Contact Details */}
            <section style={{ marginBottom: "50px" }}>
                <h2
                    style={{
                        fontSize: "40px",
                        fontWeight: "bold",
                        marginBottom: "20px",
                        textAlign: "left",
                    }}
                >
                    4. Tell Us Your Contact Details
                </h2>
                <ContactDetails
                    value={contact}
                    onChange={setContact}
                    onValidityChange={setIsContactValid}
                />
            </section>

            {/* Book Consultation Button */}
            <button
                onClick={handleRedirect}
                disabled={!isContactValid}
                style={{
                    backgroundColor: isContactValid ? "#000" : "#666",
                    color: "#fff",
                    border: "none",
                    padding: "15px 25px",
                    fontSize: "18px",
                    borderRadius: "8px",
                    cursor: isContactValid ? "pointer" : "not-allowed",
                    display: "block",
                    margin: "0 auto",
                    transition: "transform 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                Book Consultation
            </button>
        </div>
    )
}