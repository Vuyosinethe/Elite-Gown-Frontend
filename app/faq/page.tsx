"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import CartDrawer from "@/components/cart-drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const faqCategories = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping within South Africa takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by destination, typically 7-14 business days.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to most countries worldwide. International shipping costs and delivery times are calculated at checkout based on your location and the weight of your order.",
        },
        {
          question: "Is there free shipping?",
          answer:
            "Yes! We offer free standard shipping on all orders over R500 within South Africa. International orders and orders below R500 will have shipping calculated at checkout.",
        },
        {
          question: "How can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email. You can use this number to track your package on our website or directly through the courier's website.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for unused items in their original packaging. Custom embroidered items cannot be returned unless there is a manufacturing defect.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "To initiate a return, please email us at returns@elitegowns.co.za with your order number and reason for return. We'll provide you with a return authorization and instructions.",
        },
        {
          question: "Do you offer exchanges?",
          answer:
            "Yes, we offer exchanges for different sizes or colors within 30 days of purchase. Please contact our customer service team to arrange an exchange.",
        },
        {
          question: "Who pays for return shipping?",
          answer:
            "Customers are responsible for return shipping costs unless the return is due to our error (wrong item shipped, defective product, etc.).",
        },
      ],
    },
    {
      category: "Graduation Gowns",
      questions: [
        {
          question: "How do I determine the correct size for my graduation gown?",
          answer:
            "Please refer to our size guide on the product page. Graduation gowns are sized based on height and chest measurements. If you're between sizes, we recommend sizing up for a more comfortable fit.",
        },
        {
          question: "Can I rent graduation gowns instead of buying?",
          answer:
            "Yes, we offer graduation gown rentals at R299 per day. A security deposit is required and will be refunded when the gown is returned in good condition.",
        },
        {
          question: "Do you provide faculty-specific colors and regalia?",
          answer:
            "Yes, we offer faculty-specific sashes and hoods for all major South African universities. Please select your faculty when ordering to ensure you receive the correct colors.",
        },
        {
          question: "How should I care for my graduation gown?",
          answer:
            "Graduation gowns should be dry cleaned only. Store your gown in the provided garment bag in a cool, dry place. Do not iron directly on the fabric; use a steamer or iron on low heat with a cloth barrier.",
        },
      ],
    },
    {
      category: "Medical Scrubs",
      questions: [
        {
          question: "Are your medical scrubs antimicrobial?",
          answer:
            "Yes, all our medical scrubs feature antimicrobial treatment that lasts for approximately 50 washes. This helps reduce odor and bacterial growth.",
        },
        {
          question: "How should I wash my medical scrubs?",
          answer:
            "Machine wash in warm water (60°C max) with mild detergent. Avoid bleach. Tumble dry on low heat or hang to dry. Iron on medium heat if needed.",
        },
        {
          question: "Do you offer bulk discounts for medical institutions?",
          answer:
            "Yes, we offer special pricing for bulk orders from medical schools, hospitals, and clinics. Please contact our sales team at sales@elitegowns.co.za for a custom quote.",
        },
        {
          question: "Can I get custom embroidery on my medical scrubs?",
          answer:
            "We can add your name, title, institution logo, or other custom embroidery to your medical scrubs for an additional fee.",
        },
      ],
    },
    {
      category: "Custom Embroidery",
      questions: [
        {
          question: "What file formats do you accept for custom logos?",
          answer:
            "We accept vector files (.ai, .eps, .pdf) for best results. We can also work with high-resolution .png or .jpg files (300 dpi or higher).",
        },
        {
          question: "What is the minimum order for custom embroidery?",
          answer:
            "There is no minimum order quantity for custom embroidery. However, there is a one-time digitization fee for new designs, which is waived for orders of 10+ items.",
        },
        {
          question: "How long does custom embroidery take?",
          answer:
            "Standard turnaround time for custom embroidery is 5-7 business days after design approval. Rush orders may be available for an additional fee.",
        },
        {
          question: "Do you offer special rates for Wits student organizations?",
          answer:
            "Yes, we offer special pricing for Wits student organizations and social clubs. Please provide proof of affiliation when requesting a quote.",
        },
      ],
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept Visa, MasterCard, EFT (Electronic Funds Transfer), and mobile payment options. All payments are processed securely.",
        },
        {
          question: "Is VAT included in your prices?",
          answer: "Yes, all prices displayed on our website include 15% VAT.",
        },
        {
          question: "Do you offer payment plans?",
          answer:
            "Yes, we offer payment plans for orders over R2,000. Please contact our customer service team to discuss available options.",
        },
        {
          question: "Do you offer discounts for bulk orders?",
          answer:
            "Yes, we offer tiered discounts based on order quantity: 10+ items (10% off), 25+ items (15% off), 50+ items (20% off).",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent tracking-wide">
                    Elite Gowns
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400 group-hover:w-full transition-all duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-black transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-black transition-colors">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-black transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-black transition-colors">
                  Contact
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                  Cart (0)
                </button>
                <Image
                  src="/elite-gowns-logo.png"
                  alt="Elite Gowns Logo"
                  width={60}
                  height={60}
                  className="h-12 w-12"
                />
              </div>
            </div>

            {/* Mobile Navigation Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <button onClick={() => setCartOpen(true)} className="text-gray-700 hover:text-black transition-colors">
                Cart (0)
              </button>
              <Image src="/elite-gowns-logo.png" alt="Elite Gowns Logo" width={48} height={48} className="h-10 w-10" />
              <button
                type="button"
                className="p-2 rounded-md text-gray-700 hover:text-black focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {faqCategories.map((category, index) => (
            <div key={index}>
              <h2 className="text-2xl font-bold text-black mb-6 border-b pb-2">{category.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`} className="border rounded-lg">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our customer service team is here to help. Contact us and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md">Contact Us</button>
            </Link>
            <a href="mailto:info@elitegowns.co.za">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 text-black px-6 py-3 rounded-md">
                Email Us
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
