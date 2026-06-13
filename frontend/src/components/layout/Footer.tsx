import { scrollToId } from '../../lib/scroll';
import { Github, Instagram, Linkedin, Twitter, Globe, Sparkles, Code2, Rocket, Package, Smartphone } from 'lucide-react';
export default function Footer() {
    return (
        <>
            <footer id="contact" className="border-t bg-background/50 backdrop-blur-sm">
                <div className="pk-container py-10">
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                            <div className="text-lg font-semibold">About NexCart</div>
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
                            <p className="mt-1 text-sm text-muted-foreground">support@nexcart.com</p>
                        </div>
                    </div>
                    <div className="mt-10 text-xs text-muted-foreground">&copy; {new Date().getFullYear()} NexCart</div>
                </div>
            </footer>

            <section className="relative overflow-hidden border-t bg-background/40 backdrop-blur-xl">
                <div className="absolute inset-0">
                    <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
                    <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[120px]" />
                </div>
                
                <div className="pk-container relative py-10 sm:py-14 md:py-16">
                    <div className="group relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-3xl transition-all duration-700 hover:bg-black/50 hover:shadow-primary/20 dark:bg-card/40">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-sky-500/10 opacity-50" />
                        
                        <div className="relative rounded-[1.75rem] sm:rounded-[2.25rem] bg-gradient-to-b from-white/5 to-white/0 p-5 sm:p-8 md:p-12">
                            <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-14">
                                <div className="relative flex shrink-0 justify-center">
                                    <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-primary via-emerald-400 to-sky-500 opacity-20 blur-2xl transition duration-700 group-hover:opacity-40" />
                                    <div className="relative h-36 w-36 sm:h-48 sm:w-48 md:h-64 md:w-64 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border-2 border-primary/20 bg-muted/80 shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                        <img
                                            src="/AmanKanojiya.png"
                                            alt="Aman Kanojiya - Full Stack Developer"
                                            loading="lazy"
                                            decoding="async"
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                                        />
                                        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-md sm:bottom-3 sm:left-3 sm:px-3 sm:text-xs">
                                            <Code2 className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" /> React Native &amp; Next.js
                                        </div>
                                    </div>
                                </div>

                                <div className="relative flex min-w-0 flex-1 flex-col justify-center">
                                    <div className="mb-4 sm:mb-6">
                                        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                                            <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">Hi, I'm </span>
                                            <span className="bg-gradient-to-r from-primary via-emerald-400 to-sky-500 bg-clip-text text-transparent">Aman Kanojiya</span>
                                        </h2>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                                                <Sparkles className="h-3 w-3" /> Full-Stack Developer
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 backdrop-blur-md">
                                                <Code2 className="h-3 w-3" /> React Expert
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-600 backdrop-blur-md">
                                                <Rocket className="h-3 w-3" /> Performance Focused
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                            Passionate full-stack developer crafting exceptional digital experiences with modern web technologies. 
                                            Specialized in building <span className="font-semibold text-foreground">scalable applications</span>, 
                                            <span className="font-semibold text-foreground">pixel-perfect UIs</span>, and 
                                            <span className="font-semibold text-foreground">high-performance solutions</span> 
                                            that drive business growth.
                                        </p>
                                        
                                        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
                                            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 ring-2 ring-primary/10">
                                                            <Code2 className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <h4 className="text-lg font-bold bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">Tech Stack</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                                            <span className="font-medium text-foreground">Frontend</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground ml-4">React, TypeScript, Next.js, Tailwind CSS</p>
                                                        <div className="flex items-center gap-2 text-sm mt-2">
                                                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                            <span className="font-medium text-foreground">Backend</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground ml-4">Node.js, Express, MongoDB</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10">
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 ring-2 ring-emerald-500/10">
                                                            <Rocket className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                        <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">Expertise</h4>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 mt-0.5">
                                                                <Package className="h-3 w-3 text-emerald-600" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-foreground text-sm">E-commerce Development</h5>
                                                                <p className="text-xs text-muted-foreground">Full-stack online stores with payment integration</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 mt-0.5">
                                                                <Globe className="h-3 w-3 text-sky-600" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-foreground text-sm">SaaS Applications</h5>
                                                                <p className="text-xs text-muted-foreground">Scalable cloud-based business solutions</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                                                                <Smartphone className="h-3 w-3 text-primary" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-foreground text-sm">Mobile Optimization</h5>
                                                                <p className="text-xs text-muted-foreground">Performance-focused mobile experiences</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <a
                                            href="https://codedbyamankanojiya.vercel.app"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/40 active:scale-95"
                                        >
                                            <Globe className="h-5 w-5 transition-transform group-hover:rotate-12" />
                                            View Portfolio
                                            <Rocket className="ml-1 h-4 w-4 opacity-70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                        </a>
                                        
                                        <div className="flex items-center gap-2">
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
