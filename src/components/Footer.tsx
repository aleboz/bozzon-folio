import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} Alessandro Bozzon. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Delft University of Technology
        </p>
      </div>
    </footer>
  );
}
