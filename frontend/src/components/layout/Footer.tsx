import { scrollToId } from '../../lib/scroll';
import { Github, Instagram, Linkedin, Twitter, Globe, Sparkles, Code2, Rocket } from 'lucide-react';
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

            <section className="relative overflow-hidden border-t bg-background/40 backdrop-blur-xl">
                <div className="absolute inset-0">
                    <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
                </div>
                
                <div className="pk-container relative py-16">
                    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-3xl transition-all duration-700 hover:bg-black/50 hover:shadow-primary/20 dark:bg-card/40">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10 opacity-50" />
                        
                        <div className="relative rounded-[2.25rem] bg-gradient-to-b from-white/5 to-white/0 p-6 sm:p-10 md:p-12">
                            <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14">
                                <div className="relative flex shrink-0 justify-center">
                                    <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-sky-500 opacity-20 blur-2xl transition duration-700 group-hover:opacity-40" />
                                    <div className="relative h-48 w-48 overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-muted/80 shadow-2xl sm:h-56 sm:w-56 md:h-64 md:w-64">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                        <img
                                            src="/AmanKanojiya.png"
                                            alt="Aman Kanojiya - Full Stack Developer"
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                            <Code2 className="h-3 w-3 text-primary" /> React Native & Next.js
                                        </div>
                                    </div>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <div className="mb-4 inline-flex items-center gap-2">
                                        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                                            <Sparkles className="h-3.5 w-3.5" /> About the Creator
                                        </span>
                                    </div>
                                    
                                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                                        <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Hi, I'm </span>
                                        <span className="bg-gradient-to-r from-primary via-emerald-400 to-sky-500 bg-clip-text text-transparent">Aman Kanojiya</span>
                                    </h2>
                                    
                                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                        A passionate full-stack developer dedicated to building pixel-perfect, high-performance web and mobile applications. Specializing in modern architectures with <span className="font-semibold text-foreground">React</span>, <span className="font-semibold text-foreground">TypeScript</span>, and <span className="font-semibold text-foreground">Tailwind CSS</span>. Always eager to blend elegant UI design with robust backend solutions.
                                    </p>

                                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <a
                                            href="https://codedbyamankanojiya.vercel.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-95"
                                        >
                                            <Globe className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                            Visit Portfolio
                                            <Rocket className="ml-1 h-4 w-4 opacity-70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                        </a>
                                        
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <a
                                                href="https://github.com/codedbyamankanojiya"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="GitHub Profile"
                                                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-foreground hover:shadow-md"
                                            >
                                                <Github className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/in/aman-kanojiya-7386822b0"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="LinkedIn Profile"
                                                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:bg-[#0A66C2]/20 hover:text-[#0A66C2] hover:shadow-md"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="https://x.com/AKnj08?t=q_d2a3VqdDRpYaScD9Hclw&s=08"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="X (Twitter) Profile"
                                                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:text-foreground hover:shadow-md"
                                            >
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a
                                                href="https://www.instagram.com/alw4ys.ammy"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Instagram Profile"
                                                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-fuchsia-500 hover:to-indigo-500 hover:text-white hover:border-transparent hover:shadow-md"
                                            >
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
