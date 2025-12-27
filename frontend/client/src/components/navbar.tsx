import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Briefcase, Zap, Target, LayoutDashboard, LogOut, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { isAuthenticated, removeToken } from "@/lib/auth";
import { clearAllQueries } from "@/lib/queryClient";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    clearAllQueries();
    setLocation("/");
  };

  const navItems = authenticated
    ? [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/jobs", label: "Jobs", icon: Briefcase },
      { href: "/skills", label: "Skills", icon: Zap },
      { href: "/matching", label: "Matches", icon: Target },
    ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">SkillMatch</span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={location === item.href ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`link-${item.label.toLowerCase()}`}
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href="http://localhost:5000/api-docs/" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="link-swagger">
                <BookOpen className="w-4 h-4" />
                Swagger
              </Button>
            </a>
            <a href="http://localhost:5000/redoc" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="gap-2" data-testid="link-redoc">
                <FileText className="w-4 h-4" />
                Redoc
              </Button>
            </a>
            <ThemeToggle />
            {authenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="link-login">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" data-testid="link-register">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 backdrop-blur-xl bg-background/95"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setIsOpen(false)}
                    data-testid={`mobile-link-${item.label.toLowerCase()}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <a href="http://localhost:5000/api-docs/" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setIsOpen(false)}
                  data-testid="mobile-link-swagger"
                >
                  <BookOpen className="w-4 h-4" />
                  Swagger
                </Button>
              </a>
              <a href="http://localhost:5000/redoc" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => setIsOpen(false)}
                  data-testid="mobile-link-redoc"
                >
                  <FileText className="w-4 h-4" />
                  Redoc
                </Button>
              </a>
              {authenticated ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  data-testid="mobile-button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-link-login"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                      data-testid="mobile-link-register"
                    >
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
