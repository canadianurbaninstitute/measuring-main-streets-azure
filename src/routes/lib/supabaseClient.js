import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://vhyaatwvckwjemyzntnt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeWFhdHd2Y2t3amVteXpudG50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2MjYxMDUsImV4cCI6MjAyODIwMjEwNX0.aiUuc-2hwwGcGgiBgBGlJxnzr2wkHNzlN-en6F0XVcU')