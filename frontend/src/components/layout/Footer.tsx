import { scrollToId } from '../../lib/scroll';

export default function Footer() {
    return (
        <>
            <footer id="contact" className="border-t bg-background/50 backdrop-blur-sm">
                <div className="pk-container py-10">
                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <div className="text-lg font-semibold">About PopKart</div>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Your one-stop shop for the latest in tech, fashion, gadgets and more. Built for speed and
                                mobile-first usability.
                            </p>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Quick Links</div>
                            <div className="mt-2 grid gap-2 text-sm text-muted-foreground">
                                <button type="button" className="w-fit hover:text-foreground" onClick={() => scrollToId('shop')}>
                                    Shop
                                </button>
                                <button
                                    type="button"
                                    className="w-fit hover:text-foreground"
                                    onClick={() => scrollToId('categories')}
                                >
                                    Categories
                                </button>
                                <button type="button" className="w-fit hover:text-foreground" onClick={() => scrollToId('contact')}>
                                    Contact
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="text-lg font-semibold">Contact</div>
                            <p className="mt-2 text-sm text-muted-foreground">Mumbai, India</p>
                            <p className="mt-1 text-sm text-muted-foreground">support@popkart.com</p>
                        </div>
                    </div>
                    <div className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} PopKart</div>
                </div>
            </footer>

            <section className="border-t bg-background/50 backdrop-blur-sm">
                <div className="pk-container py-10">
                    <div className="relative overflow-hidden rounded-2xl border bg-card/70 p-6 shadow-sm backdrop-blur pk-glass">
                        <div className="pointer-events-none absolute inset-0">
                            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                            <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
                        </div>

                        <div className="relative grid gap-6 md:grid-cols-[220px_1fr]">
                            <div className="relative">
                                <div className="aspect-square w-full overflow-hidden rounded-2xl border bg-muted">
                                    <img
                                        src="/AmanKanojiya.png"
                                        alt="Aman Kanojiya"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                                    />
                                </div>
                            </div>

                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-primary">About the Developer</div>
                                <h2 className="mt-2 text-2xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">Aman Kanojiya</h2>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    Full-stack developer specializing in modern e-commerce solutions. This project showcases expertise in <span className="font-medium text-foreground">React</span>, <span className="font-medium text-foreground">TypeScript</span>, and <span className="font-medium text-foreground">Tailwind CSS</span> with a focus on performance, accessibility, and user experience.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    <a
                                        href="https://codedbyamankanojiya.vercel.app"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pk-btn pk-btn-primary pk-btn-shine h-10 px-5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        🌐 Portfolio
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/aman-kanojiya-7386822b0"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pk-btn pk-btn-outline pk-btn-shine h-10 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        LinkedIn
                                    </a>
                                    <a
                                        href="https://github.com/codedbyamankanojiya"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pk-btn pk-btn-outline pk-btn-shine h-10 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        GitHub
                                    </a>
                                    <a
                                        href="https://x.com/AKnj08?t=q_d2a3VqdDRpYaScD9Hclw&s=08"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pk-btn pk-btn-outline pk-btn-shine h-10 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        X
                                    </a>
                                    <a
                                        href="https://www.instagram.com/alw4ys.ammy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pk-btn pk-btn-outline pk-btn-shine h-10 px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        Instagram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
